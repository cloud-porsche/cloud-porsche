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

@Injectable()
export class ParkingService {
  private readonly logger = new Logger(ParkingService.name);
  private readonly parkingPropertiesApi: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
    private readonly pubSubService: PubSubService,
  ) {
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
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    updateData: Partial<IParkingProperty>,
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.patch<IParkingProperty>(
          `${this.parkingPropertiesApi}/v1/parking-properties/${parkingPropertyId}`,
          updateData,
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
      this.logger.error(`Failed to update parking property: ${error.message}`);
      throw new Error('Failed to update parking property');
    }
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
    return this.updateParkingProperty(token, tenantId, parkingPropertyId, {
      customers: [...currentCustomers, newCustomer],
    });
  }

  async leave(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    customer: Customer,
  ) {
    const parkingProperty = await this.fetchParkingProperty(
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

    return this.updateParkingProperty(token, tenantId, parkingPropertyId, {
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
      [ParkingSpotState.OCCUPIED, ParkingSpotState.OUT_OF_ORDER].includes(
        spot.state,
      )
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
      token,
      tenantId,
      parkingPropertyId,
      this.newSpotState(
        parkingProperty,
        spotId,
        ParkingSpotState.OCCUPIED,
        customer,
      ),
    );
  }

  async freeSpot(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    spotId: string,
    simulated_duration: number = 0,
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
      spot.state !== ParkingSpotState.OCCUPIED &&
      spot.state !== ParkingSpotState.CHARGING
    )
      throw new Error('Spot not occupied');
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
      parkingDuration:
        (new Date().getTime() - new Date(spot.lastStateChange).getTime()) /
          1000 /
          60 /
          60 +
        simulated_duration,
    });
    return this.updateParkingProperty(
      token,
      tenantId,
      parkingPropertyId,
      this.newSpotState(parkingProperty, spotId, ParkingSpotState.FREE),
    );
  }

  async chargeSpot(
    token: string,
    tenantId: string,
    parkingPropertyId: string,
    spotId: string,
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
    if (spot.state !== ParkingSpotState.OCCUPIED && !spot.electricCharging)
      throw new Error('Spot already occupied or not an electric charger');
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
      token,
      tenantId,
      parkingPropertyId,
      this.newSpotState(
        parkingProperty,
        spotId,
        ParkingSpotState.CHARGING,
        spot.customer,
      ),
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
