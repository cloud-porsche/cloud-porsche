import * as crypto from "node:crypto";

export enum ParkingSpotState {
  FREE,
  OCCUPIED,
  RESERVED,
  OUT_OF_ORDER,
}

/**
 * The type of a parking property.
 * TRACK_TOTAL: The parking property has a gate and can only track in/out-going cars.
 * TRACK_INDIVIDUAL: The parking property can track individual parking spots.
 */
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
  visualLayers: ParkingSpotLayers[];
}

export class ParkingSpotLayers {
  floor: number;
  name: string;
  description: string;
  spotCount: number;
  columns: number;

  constructor(obj?: Partial<ParkingSpot>) {
    Object.assign(this, obj);
  }
}

export class ParkingSpot {
  id: string = crypto.randomUUID();
  state: ParkingSpotState = ParkingSpotState.FREE;
  lastStateChange: Date = new Date();
  electricCharging: boolean = false;
  customer: Customer | null = null;
  placeholder: boolean = false;

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
