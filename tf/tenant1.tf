provider "helm" {
  alias = "tenant1"
  kubernetes {
    host  = "https://${module.tenant1.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.tenant1.client_certificate)
    client_key = base64decode(module.tenant1.client_key)
    cluster_ca_certificate = base64decode(module.tenant1.cluster_ca_certificate)
  }
}

module "tenant1" {
  source         = "./enterprise-tenant"
  tenant_id      = "tenant1"
  firebase_token = var.firebase_token
  providers = {
    helm = helm.tenant1
  }
}
