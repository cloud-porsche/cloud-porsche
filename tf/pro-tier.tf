provider "helm" {
  alias = "pro-tier"
  kubernetes {
    host  = "https://${module.pro-tier.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.pro-tier.client_certificate)
    client_key = base64decode(module.pro-tier.client_key)
    cluster_ca_certificate = base64decode(module.pro-tier.cluster_ca_certificate)
  }
}

module "pro-tier" {
  source         = "./enterprise-tenant"
  tenant_id      = "pro-tier"
  firebase_token = var.firebase_token
  location       = "europe-west4"
  image_tag      = var.image_tag
  providers = {
    helm = helm.pro-tier
  }
}
