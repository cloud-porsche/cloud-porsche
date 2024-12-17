provider "helm" {
  alias = "tenant2"
  kubernetes {
    host  = "https://${module.enterprise_tenant-2.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.enterprise_tenant-2.client_certificate)
    client_key = base64decode(module.enterprise_tenant-2.client_key)
    cluster_ca_certificate = base64decode(module.enterprise_tenant-2.cluster_ca_certificate)
  }
}

module "enterprise_tenant-2" {
  source    = "./enterprise-tenant"
  tenant_id = "tenant2"
  providers = {
    helm = helm.tenant2
  }
}
