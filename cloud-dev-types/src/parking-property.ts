import * as crypto from "node:crypto";

export enum ParkingSpotState {
  FREE,
  OCCUPIED,
  RESERVED,
  OUT_OF_ORDER,
  CHARGING,
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

export abstract class IParkingProperty {
  id: string;
  name: string;
  location: string;
  description: string;
  lastModified: Date;
  pricePerHour: number;
  customers: Customer[];
  parkingType: ParkingPropertyType;
  layers: ParkingSpotLayer[];
  defects: string[];
}

export class ParkingSpotLayer {
  floor: number;
  name: string;
  description: string;
  spotCount: number;
  columns: number;
  idPattern: string;
  parkingSpots: ParkingSpot[];

  constructor(obj?: Partial<ParkingSpotLayer>) {
    Object.assign(this, obj);

    if (obj?.parkingSpots) {
      this.parkingSpots = obj.parkingSpots.map((spot) => {
        return { ...new ParkingSpot(spot) };
      });
    }
  }
}

export class ParkingSpot {
  id: string = crypto.randomUUID();
  state: ParkingSpotState = ParkingSpotState.FREE;
  lastStateChange: Date = new Date();
  customer: Customer | null = null;
  placeholder: boolean = false;
  electricCharging: boolean = false;
  currentCharge?: number;

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
