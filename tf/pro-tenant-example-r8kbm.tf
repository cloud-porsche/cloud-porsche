module "pro-tenant-example-r8kbm" {
  source      = "./pro-tenant"
  tenant_id   = "pro-tenant-example-r8kbm"
  tenant_name = "Pro Example Tenant"
  admin_email = "osi.borkenhagen@gmail.com"
  pro_ip      = module.pro-tier.ingress_hostname
}
