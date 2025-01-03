import { DefectState, IDefect } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class Defect implements IDefect {
  id: string;
  propertyId: string;
  tenantId: string;
  name: string;
  location: string;
  descriptionShort: string;
  descriptionLong: string;
  reportedDate: Date;
  status: DefectState = DefectState.OPEN;
  image: string;
  lastModified: Date = new Date();

  constructor(obj?: Partial<Defect>) {
    Object.assign(this, obj);
  }
}
