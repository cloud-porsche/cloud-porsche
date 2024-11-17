import { Injectable, Logger } from '@nestjs/common';
import { ParkingPropertiesService } from '../parking-properties/parking-properties.service';
import { Customer, ParkingSpotState } from '@cloud-porsche/types';

@Injectable()
export class ParkingService {
  private readonly logger = new Logger(ParkingService.name);

  constructor(
    public readonly parkingPropertiesService: ParkingPropertiesService,
  ) {}

  async enter(parkingPropertyId: string, newCustomer: Customer) {
    const parkingProperty =
      await this.parkingPropertiesService.findOne(parkingPropertyId);
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];
    return this.parkingPropertiesService.update(parkingPropertyId, {
      customers: [...currentCustomers, newCustomer],
    });
  }

  async leave(parkingPropertyId: string, customer: Customer) {
    const parkingProperty =
      await this.parkingPropertiesService.findOne(parkingPropertyId);
    if (!parkingProperty) throw new Error('Parking Property not found');
    const currentCustomers = parkingProperty.customers ?? [];
    const spot = parkingProperty.parkingSpots.find(
      (s) => s.customer?.id === customer.id,
    );
    if (spot) {
      this.logger.warn('Customer still has a spot occupied - setting it free');
      await this.freeSpot(parkingPropertyId, spot.id);
    }
    return this.parkingPropertiesService.update(parkingPropertyId, {
      customers: currentCustomers.filter((c) => c.id !== customer.id),
    });
  }

  async occupySpot(
    parkingPropertyId: string,
    spotId: string,
    customer: Customer,
  ) {
    const parkingProperty =
      await this.parkingPropertiesService.findOne(parkingPropertyId);
    const spot = parkingProperty.parkingSpots.find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (
      [ParkingSpotState.OCCUPIED, ParkingSpotState.OUT_OF_ORDER].includes(
        spot.state,
      )
    )
      throw new Error('Spot already occupied or out of order');
    return this.parkingPropertiesService.update(parkingPropertyId, {
      parkingSpots: parkingProperty.parkingSpots.map((s) =>
        s.id === spotId
          ? {
              ...s,
              state: ParkingSpotState.OCCUPIED,
              lastStateChange: new Date(),
              customer,
            }
          : s,
      ),
    });
  }

  async freeSpot(parkingPropertyId: string, spotId: string) {
    const parkingProperty =
      await this.parkingPropertiesService.findOne(parkingPropertyId);
    const spot = parkingProperty.parkingSpots.find((s) => s.id === spotId);
    if (!spot) throw new Error('Spot not found');
    if (spot.state !== ParkingSpotState.OCCUPIED)
      throw new Error('Spot not occupied');
    return this.parkingPropertiesService.update(parkingPropertyId, {
      parkingSpots: parkingProperty.parkingSpots.map((s) =>
        s.id === spotId
          ? {
              ...s,
              state: ParkingSpotState.FREE,
              lastStateChange: new Date(),
              customer: null,
            }
          : s,
      ),
    });
  }
}
