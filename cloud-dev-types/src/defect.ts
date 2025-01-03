export enum DefectState {
  OPEN,
  IN_WORK,
  REJECTED,
  DONE,
}

export interface IDefect {
  id: string;
  propertyId: string;
  tenantId: string;
  name: string;
  location: string;
  descriptionShort: string;
  descriptionLong: string;
  reportedDate: Date;
  status: DefectState;
  image: string;
  lastModified: Date;
}
