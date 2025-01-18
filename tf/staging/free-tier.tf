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

provider "kubernetes" {
  alias = "free-tier"
  host  = "https://${module.free-tier.cluster_endpoint}"
  token = data.google_client_config.default.access_token
  client_certificate = base64decode(module.free-tier.client_certificate)
  client_key = base64decode(module.free-tier.client_key)
  cluster_ca_certificate = base64decode(module.free-tier.cluster_ca_certificate)
}

module "free-tier" {
  # 1 Enterprise Tenant equals our free-tier
  source              = "../enterprise-tenant"
  tenant_id           = "free-tier"
  tenant_name         = "free-tier"
  firebase_token      = var.firebase_token
  location            = "europe-north1"
  image_tag           = var.image_tag
  admin_email         = "osi.borkenhagen@gmail.com"
  free_tier_overwrite = true
  providers = {
    helm       = helm.free-tier
    kubernetes = kubernetes.free-tier
  }
}
