export enum DefectStates {
  OPEN,
  IN_WORK,
  REJECTED,
  DONE,
}

export interface IDefect {
  id: number;
  name: string;
  location: string;
  descriptionShort: string;
  descriptionLong: string;
  reportedDate: Date;
  status: DefectStates;
}
