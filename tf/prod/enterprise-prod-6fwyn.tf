provider "helm" {
  alias = "enterprise-prod-6fwyn"
  kubernetes {
    host  = "https://${module.enterprise-prod-6fwyn.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.enterprise-prod-6fwyn.client_certificate)
    client_key = base64decode(module.enterprise-prod-6fwyn.client_key)
    cluster_ca_certificate = base64decode(module.enterprise-prod-6fwyn.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  alias = "enterprise-prod-6fwyn"
  host  = "https://${module.enterprise-prod-6fwyn.cluster_endpoint}"
  token = data.google_client_config.default.access_token
  client_certificate = base64decode(module.enterprise-prod-6fwyn.client_certificate)
  client_key = base64decode(module.enterprise-prod-6fwyn.client_key)
  cluster_ca_certificate = base64decode(module.enterprise-prod-6fwyn.cluster_ca_certificate)
}

module "enterprise-prod-6fwyn" {
  source         = "../enterprise-tenant"
  tenant_id      = "enterprise-prod-6fwyn"
  tenant_name    = "Enterprise Prod"
  firebase_token = var.firebase_token
  location       = "northamerica-northeast2"
  admin_email    = "osi.borkenhagen@gmail.com"
  image_tag      = var.image_tag
  prod           = true
  providers = {
    helm       = helm.enterprise-prod-6fwyn
    kubernetes = kubernetes.enterprise-prod-6fwyn
  }
}
