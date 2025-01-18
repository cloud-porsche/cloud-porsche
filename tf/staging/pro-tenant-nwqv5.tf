module "pro-tenant-nwqv5" {
  source      = "../pro-tenant"
  tenant_id   = "pro-tenant-nwqv5"
  tenant_name = "Pro Tenant"
  admin_email = "osi.borkenhagen@gmail.com"
  pro_ip      = module.pro-tier.ingress_hostname
}
