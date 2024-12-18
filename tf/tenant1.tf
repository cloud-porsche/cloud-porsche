provider "helm" {
  alias = "tenant1"
  kubernetes {
    host  = "https://${module.enterprise_tenant-1.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.enterprise_tenant-1.client_certificate)
    client_key = base64decode(module.enterprise_tenant-1.client_key)
    cluster_ca_certificate = base64decode(module.enterprise_tenant-1.cluster_ca_certificate)
  }
}

module "enterprise_tenant-1" {
  source         = "./enterprise-tenant"
  tenant_id      = "tenant1"
  firebase_token = var.firebase_token
  providers = {
    helm = helm.tenant1
  }
}
