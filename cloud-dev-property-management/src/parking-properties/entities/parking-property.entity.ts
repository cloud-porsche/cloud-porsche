import { Collection } from 'fireorm';
import {
  Customer,
  IParkingProperty,
  ParkingPropertyType,
  ParkingSpot,
} from '@cloud-porsche/types';

@Collection()
export class ParkingProperty implements IParkingProperty {
  id: string;
  name: string;
  location: string;
  description: string;
  pricePerHour: number;
  parkingType: ParkingPropertyType;
  lastModified: Date = new Date();
  parkingSpots: ParkingSpot[] = [];
  customers: Customer[] = [];

  constructor(obj?: Partial<ParkingProperty>) {
    Object.assign(this, obj);
    if (obj?.parkingSpots) {
      this.parkingSpots = obj.parkingSpots.map((spot) => {
        return { ...new ParkingSpot(spot) };
      });
    }
    if (obj?.customers) {
      this.customers = obj.customers.map((c) => {
        return { ...new Customer(c) };
      });
    }
  }
}
