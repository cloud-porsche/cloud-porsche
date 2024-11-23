import { Collection } from 'fireorm';
import {
  Customer,
  IParkingProperty,
  ParkingSpotLayer,
} from '@cloud-porsche/types';

@Collection()
export class ParkingProperty extends IParkingProperty {
  pricePerHour: number = 1;
  lastModified: Date = new Date();
  customers: Customer[] = [];
  layers: ParkingSpotLayer[] = [];

  constructor(obj?: Partial<IParkingProperty>) {
    super();
    Object.assign(this, obj);
    if (obj?.layers) {
      this.layers = obj.layers.map((layer) => {
        return { ...new ParkingSpotLayer(layer) };
      });
    }
    if (obj?.customers) {
      this.customers = obj.customers.map((c) => {
        return { ...new Customer(c) };
      });
    }
  }
}
