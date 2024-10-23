export enum DefectState {
  OPEN,
  IN_WORK,
  REJECTED,
  DONE,
}

export interface IDefect {
  id: string;
  name: string;
  location: string;
  descriptionShort: string;
  descriptionLong: string;
  reportedDate: Date;
  status: DefectState;
}
