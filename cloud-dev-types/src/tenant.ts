export enum TenantTier {
  FREE,
  PRO,
  ENTERPRISE,
}

export abstract class ITenant {
  tenantId: string;
  tenantName: string;
  tier: TenantTier;
  adminEmail: string;
  ip: string;
}
