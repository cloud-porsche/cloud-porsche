import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  Customer,
  IParkingProperty,
  ParkingSpotState,
} from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { PubSubService } from 'src/pubsub/pubsub.service';
import { ParkingProperty } from './entities/parking-property.entity';
import { BaseFirestoreRepository, EntityConstructorOrPath, getRepository } from 'fireorm';

@Injectable()
export class ParkingService {
  private readonly logger = new Logger(ParkingService.name);
  private readonly parkingPropertiesApi: string;
  private readonly parkingPropertyRepository: BaseFirestoreRepository<ParkingProperty>;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly pubSubService: PubSubService,
    repositoryClass: EntityConstructorOrPath<ParkingProperty>,
  ) {
    this.parkingPropertyRepository = getRepository(repositoryClass);
    this.parkingPropertiesApi = this.config.get<string>(
      'PROPERTY_MANAGEMENT_API_URL',
    );
  }

  private async fetchParkingProperty(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<IParkingProperty>(
          `${this.parkingPropertiesApi}/v1/parking-properties/${parkingPropertyId}`,
          {
            headers: {
              authorization: token,
              'tenant-id': tenantId,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch parking property: ${error.message}`);
      throw new Error('Parking Property not found');
    }
  }

  private async updateParkingProperty(
    parkingPropertyId: string,
    updateData: Partial<IParkingProperty>,
  ) {
    const toUpdate = {
      id: parkingPropertyId,
      ...updateData,
    };
    return this.parkingPropertyRepository.update(toUpdate as ParkingProperty);
  }

  // This method will publish the message to Pub/Sub when a customer enters
  async enter(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    newCustomer: Customer,
  ) {
    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      parkingPropertyId,
    );
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];

    await this.pubSubService.publishMessage({
      messageType: 'parking',
      tenantId: tenantId,
      action: 'enter',
      timestamp: new Date(),
      properyId: parkingPropertyId,
      propertyName: parkingProperty.name,
      spotId: null,
      currentUtilization: this.getUtilization(parkingProperty),
      costPerHour: parkingProperty.pricePerHour,
      parkingDuration: null,
    });
    // Update the customers in the parking property
    return this.updateParkingProperty(parkingPropertyId, {
      customers: [...currentCustomers, newCustomer],
    });
  }

  async leave(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    customer: Customer,
    parkingProperty?: IParkingProperty,
  ) {
    parkingProperty = parkingProperty ?? await this.fetchParkingProperty(
      token,
      tenantId,
      parkingPropertyId,
    );
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.customer?.id === customer.id);
    if (spot) {
      this.logger.warn('Customer still has a spot occupied - setting it free');
      await this.freeSpot(token, tenantId, parkingPropertyId, spot.id);
    }
    await this.pubSubService.publishMessage({
      messageType: 'parking',
      tenantId: tenantId,
      action: 'leave',
      timestamp: new Date(),
      properyId: parkingPropertyId,
      propertyName: parkingProperty.name,
      spotId: null,
      currentUtilization: this.getUtilization(parkingProperty),
      costPerHour: parkingProperty.pricePerHour,
      parkingDuration: null,
    });

    return this.updateParkingProperty(parkingPropertyId, {
      customers: currentCustomers.filter((c) => c.id !== customer.id),
    });
  }

  async occupySpot(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    spotId: string,
    customer: Customer,
  ) {
    const parkingProperty = await this.fetchParkingProperty(
      token,
      tenantId,
      parkingPropertyId,
    );
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (
      [
        ParkingSpotState.OCCUPIED,
        ParkingSpotState.CHARGING,
        ParkingSpotState.OUT_OF_ORDER,
      ].includes(spot.state)
    ) {
      throw new Error('Spot already occupied or out of order');
    }
    await this.pubSubService.publishMessage({
      messageType: 'parking',
      tenantId: tenantId,
      action: 'occupy',
      timestamp: new Date(),
      properyId: parkingPropertyId,
      propertyName: parkingProperty.name,
      spotId: spot.id,
      currentUtilization: this.getUtilization(parkingProperty),
      costPerHour: parkingProperty.pricePerHour,
      parkingDuration: null,
    });

    return this.updateParkingProperty(
      parkingPropertyId,
      this.newSpotState(
        parkingProperty,
        spotId,
        !spot.electricCharging
          ? ParkingSpotState.OCCUPIED
          : ParkingSpotState.CHARGING,
        customer,
      ),
    );
  }

  async freeSpot(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    spotId: string,
    simulatedDuration?: number,
    parkingProperty?: IParkingProperty,
  ) {
    parkingProperty = parkingProperty ?? await this.fetchParkingProperty(
      token,
      tenantId,
      parkingPropertyId,
    );
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (
      spot.state !== ParkingSpotState.OCCUPIED &&
      spot.state !== ParkingSpotState.CHARGING
    )
      throw new Error('Spot not occupied');

    const parkingDuration = (new Date().getTime() - new Date(spot.lastStateChange).getTime()) / 1000 / 60 / 60 + (simulatedDuration ?? 0);
    const toPay = parkingDuration * parkingProperty.pricePerHour;

    await this.pubSubService.publishMessage({
      messageType: 'parking',
      tenantId: tenantId,
      action: 'free',
      timestamp: new Date(),
      properyId: parkingPropertyId,
      propertyName: parkingProperty.name,
      spotId: spot.id,
      currentUtilization: this.getUtilization(parkingProperty),
      costPerHour: parkingProperty.pricePerHour,
      parkingDuration: parkingDuration,
    });
    return this.updateParkingProperty(
      parkingPropertyId,
      {
        ...this.newSpotState(parkingProperty, spotId, ParkingSpotState.FREE),
        ...this.newCustomerState(parkingProperty, spot.customer.id, toPay),
      }
    );
  }

  private newSpotState(
    parkingProperty: IParkingProperty,
    spotId: string,
    state: ParkingSpotState,
    customer: Customer = null,
  ) {
    return {
      layers: parkingProperty.layers.map((l) => {
        l.parkingSpots = l.parkingSpots.map((s) =>
          s.id === spotId
            ? {
                ...s,
                state: state,
                lastStateChange: new Date(),
                customer: customer,
              }
            : s,
        );
        return l;
      }),
    };
  }

  private newCustomerState(
    parkingProperty: IParkingProperty,
    customerId: string,
    toPay: number,
  ) {
    return {
      customers: parkingProperty.customers.map((c) =>
        c.id === customerId
          ? {
              ...c,
              toPay: toPay,
            }
          : c,
      ),
    };
  }

  private getUtilization(parkingProperty: IParkingProperty) {
    const totalSpots = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .filter((s) => !s.placeholder).length;
    const occupiedSpots = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .filter((s) => s.state === ParkingSpotState.OCCUPIED).length;
    return (occupiedSpots / totalSpots) * 100;
  }
}
