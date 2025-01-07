module "pro-example-tenant" {
  source      = "./pro-tenant"
  tenant_id   = "pro-example-tenant"
  tenant_name = "pro example tenant"
  admin_email = "osi.borkenhagen@gmail.com"
  pro_ip      = module.pro-tier.ingress_ip
}
