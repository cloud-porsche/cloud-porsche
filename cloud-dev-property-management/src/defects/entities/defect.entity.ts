import { DefectState, IDefect } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class Defect implements IDefect {
  id: string;
  name: string;
  location: string;
  descriptionShort: string;
  descriptionLong: string;
  reportedDate: Date;
  status: DefectState = DefectState.OPEN;

  constructor(obj?: Partial<Defect>) {
    Object.assign(this, obj);
  }
}
