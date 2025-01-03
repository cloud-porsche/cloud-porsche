export interface IApiCall {
  id: string;
  tenantId: string;
  method: string;
  timestamp: Date;
  url: string;
}
