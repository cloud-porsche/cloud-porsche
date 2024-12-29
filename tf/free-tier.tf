provider "helm" {
  alias = "free-tier"
  kubernetes {
    host  = "https://${module.free-tier.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.free-tier.client_certificate)
    client_key = base64decode(module.free-tier.client_key)
    cluster_ca_certificate = base64decode(module.free-tier.cluster_ca_certificate)
  }
}

module "free-tier" {
  # 1 Enterprise Tenant equals our free-tier
  source         = "./enterprise-tenant"
  tenant_id      = "free-tier"
  firebase_token = var.firebase_token
  providers = {
    helm = helm.free-tier
  }
}
