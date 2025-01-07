import { ITenant, TenantTier } from "@cloud-porsche/types"
import { Collection } from "fireorm";

@Collection()
export class Tenant implements ITenant {
  id: string;
  tenantId: string;
  tenantName: string;
  adminEmail: string;
  tier: TenantTier;
  ip: string;

  constructor(obj?: Partial<Tenant>) {
    Object.assign(this, obj);
  }
}