import { IParkingAction } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class ParkingAction implements IParkingAction {
  tenantId: string;
  id: string;
  action: string;
  timestamp: Date;
  propertyId: string;
  propertyName: string;
  spotId: string;
  currentUtilization: number;
  costPerHour: number;
  parkingDuration: number;

  constructor(obj?: Partial<ParkingAction>) {
    Object.assign(this, obj);
  }
}
