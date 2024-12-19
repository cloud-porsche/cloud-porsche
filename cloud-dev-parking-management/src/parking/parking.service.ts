import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Customer, ParkingSpotState } from '@cloud-porsche/types';
import { IParkingProperty } from '@cloud-porsche/types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ParkingService {
  private readonly logger = new Logger(ParkingService.name);
  private readonly parkingPropertiesApi: string = 'http://localhost:8080/v1';

  constructor(private readonly httpService: HttpService) {}

  private async fetchParkingProperty(
    parkingPropertyId: string,
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.get<IParkingProperty>(
          `${this.parkingPropertiesApi}/parking-properties/${parkingPropertyId}`,
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
  ): Promise<IParkingProperty> {
    try {
      const response = await lastValueFrom(
        this.httpService.patch<IParkingProperty>(
          `${this.parkingPropertiesApi}/parking-properties/${parkingPropertyId}`,
          updateData,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update parking property: ${error.message}`);
      throw new Error('Failed to update parking property');
    }
  }

  // This method will publish the message to Pub/Sub when a customer enters
  async enter(parkingPropertyId: string, newCustomer: Customer) {
    const parkingProperty = await this.fetchParkingProperty(parkingPropertyId);
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];

    // Update the customers in the parking property
    return this.updateParkingProperty(parkingPropertyId, {
      customers: [...currentCustomers, newCustomer],
    });
  }

  async leave(parkingPropertyId: string, customer: Customer) {
    const parkingProperty = await this.fetchParkingProperty(parkingPropertyId);
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.customer?.id === customer.id);
    if (spot) {
      this.logger.warn('Customer still has a spot occupied - setting it free');
      await this.freeSpot(parkingPropertyId, spot.id);
    }
    return this.updateParkingProperty(parkingPropertyId, {
      customers: currentCustomers.filter((c) => c.id !== customer.id),
    });
  }

  async occupySpot(
    parkingPropertyId: string,
    spotId: string,
    customer: Customer,
  ) {
    const parkingProperty = await this.fetchParkingProperty(parkingPropertyId);
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (
      [ParkingSpotState.OCCUPIED, ParkingSpotState.OUT_OF_ORDER].includes(
        spot.state,
      )
    )
      throw new Error('Spot already occupied or out of order');
    return this.updateParkingProperty(
      parkingPropertyId,
      this.newSpotState(
        parkingProperty,
        spotId,
        ParkingSpotState.OCCUPIED,
        customer,
      ),
    );
  }

  async freeSpot(parkingPropertyId: string, spotId: string) {
    const parkingProperty = await this.fetchParkingProperty(parkingPropertyId);
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (spot.state !== ParkingSpotState.OCCUPIED)
      throw new Error('Spot not occupied');
    return this.updateParkingProperty(
      parkingPropertyId,
      this.newSpotState(parkingProperty, spotId, ParkingSpotState.FREE),
    );
  }

  async chargeSpot(parkingPropertyId: string, spotId: string) {
    const parkingProperty = await this.fetchParkingProperty(parkingPropertyId);
    const spot = parkingProperty.layers
      .flatMap((l) => l.parkingSpots)
      .find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (spot.state !== ParkingSpotState.OCCUPIED && !spot.electricCharging)
      throw new Error('Spot already occupied or not an electric charger');
    return this.updateParkingProperty(
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
}
