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
  id: string;
  state: ParkingSpotState = ParkingSpotState.FREE;
  lastStateChange: Date = new Date();
  electricCharging: boolean = false;
  customer: Customer | null = null;
}

export class Customer {
  id: string;
  licensePlate: string;
}
