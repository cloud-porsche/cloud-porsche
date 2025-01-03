export interface IParkingAction {
  id: string;
  tenantId: string;
  action: string;
  timestamp: Date;
  propertyId: string;
  propertyName: string;
  spotId: string;
  currentUtilization: number;
  costPerHour: number;
  parkingDuration: number;
}
