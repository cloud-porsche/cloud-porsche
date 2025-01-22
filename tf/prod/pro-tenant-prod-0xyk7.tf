module "pro-tenant-prod-0xyk7" {
  source      = "../pro-tenant"
  tenant_id   = "pro-tenant-prod-0xyk7"
  tenant_name = "Pro Tenant Prod"
  admin_email = "osi.borkenhagen@gmail.com"
  pro_ip      = module.pro-tier.ingress_hostname
}
