module "porsche-ag-wajfw" {
  source      = "../pro-tenant"
  tenant_id   = "porsche-ag-wajfw"
  tenant_name = "Porsche AG"
  admin_email = "osi.borkenhagen@gmail.com"
  pro_ip      = module.pro-tier.ingress_hostname
}
