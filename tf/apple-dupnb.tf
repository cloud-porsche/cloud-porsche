provider "helm" {
  alias = "apple-dupnb"
  kubernetes {
    host  = "https://${module.apple-dupnb.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.apple-dupnb.client_certificate)
    client_key = base64decode(module.apple-dupnb.client_key)
    cluster_ca_certificate = base64decode(module.apple-dupnb.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  alias = "apple-dupnb"
  host  = "https://${module.apple-dupnb.cluster_endpoint}"
  token = data.google_client_config.default.access_token
  client_certificate = base64decode(module.apple-dupnb.client_certificate)
  client_key = base64decode(module.apple-dupnb.client_key)
  cluster_ca_certificate = base64decode(module.apple-dupnb.cluster_ca_certificate)
}

module "apple-dupnb" {
  source         = "./enterprise-tenant"
  tenant_id      = "apple-dupnb"
  tenant_name    = "Apple"
  firebase_token = var.firebase_token
  location       = "us-central1"
  admin_email    = "osi.borkenhagen@gmail.com"
  image_tag      = var.image_tag
  providers = {
    helm       = helm.apple-dupnb
    kubernetes = kubernetes.apple-dupnb
  }
}
