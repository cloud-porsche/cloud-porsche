import { IParkingAction } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class ParkingAction implements IParkingAction {
  id: string;
  action: string;
  timestamp: Date;
  propertyId: string;
  propertyName: string;
  spotId: string;

  constructor(obj?: Partial<ParkingAction>) {
    Object.assign(this, obj);
  }
}
