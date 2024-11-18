import * as crypto from "node:crypto";

export enum ParkingSpotState {
  FREE,
  OCCUPIED,
  RESERVED,
  OUT_OF_ORDER,
}

export enum ParkingPropertyType {
  TRACK_TOTAL,
  TRACK_INDIVIDUAL,
}

export interface IParkingProperty {
  id: string;
  name: string;
  location: string;
  description: string;
  lastModified: Date;
  pricePerHour: number;
  parkingSpots: ParkingSpot[];
  customers: Customer[];
  parkingType: ParkingPropertyType;
}

export class ParkingSpot {
  id: string = crypto.randomUUID();
  state: ParkingSpotState = ParkingSpotState.FREE;
  lastStateChange: Date = new Date();
  electricCharging: boolean = false;
  customer: Customer | null = null;

  constructor(obj?: Partial<ParkingSpot>) {
    Object.assign(this, obj);
  }
}

export class Customer {
  id: string = crypto.randomUUID();
  licensePlate: string;

  constructor(obj?: Partial<Customer>) {
    Object.assign(this, obj);
  }
}
