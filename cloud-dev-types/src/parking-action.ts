export interface IParkingAction {
  id: string;
  action: string;
  timestamp: Date;
  propertyId: string;
  propertyName: string;
  spotId: string;
}
