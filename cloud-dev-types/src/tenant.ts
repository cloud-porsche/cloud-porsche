export enum TenantTier {
    FREE,
    PRO,
    ENTERPRISE,
  }
  
  export abstract class ITenant {
    id: string;
    tenantId: string;
    tenantName: string;
    type: TenantTier;
    adminEmail: string;
  }
  