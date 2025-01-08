import { DefectState, IDefectAction } from '@cloud-porsche/types';
import { Collection } from 'fireorm';

@Collection()
export class DefectAction implements IDefectAction{
  id: string;
  tenantId: string;
  action: string;
  propertyId: string;
  propertyName: string;
  defectId: string;
  defectState: DefectState;
  date: Date;

  constructor(obj?: Partial<DefectAction>) {
    Object.assign(this, obj);
  }
}
