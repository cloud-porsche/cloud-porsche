export enum TenantTier {
  FREE,
  PRO,
  ENTERPRISE,
}

export abstract class ITenant {
  id: string;
  tenantId: string;
  tenantName: string;
  tier: TenantTier;
  adminEmail: string;
}
