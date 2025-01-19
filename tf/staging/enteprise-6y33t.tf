provider "helm" {
  alias = "enteprise-6y33t"
  kubernetes {
    host  = "https://${module.enteprise-6y33t.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.enteprise-6y33t.client_certificate)
    client_key = base64decode(module.enteprise-6y33t.client_key)
    cluster_ca_certificate = base64decode(module.enteprise-6y33t.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  alias = "enteprise-6y33t"
  host  = "https://${module.enteprise-6y33t.cluster_endpoint}"
  token = data.google_client_config.default.access_token
  client_certificate = base64decode(module.enteprise-6y33t.client_certificate)
  client_key = base64decode(module.enteprise-6y33t.client_key)
  cluster_ca_certificate = base64decode(module.enteprise-6y33t.cluster_ca_certificate)
}

module "enteprise-6y33t" {
  source         = "../enterprise-tenant"
  tenant_id      = "enteprise-6y33t"
  tenant_name    = "Enteprise"
  firebase_token = var.firebase_token
  location       = "us-central1"
  admin_email    = "osi.borkenhagen@gmail.com"
  image_tag      = var.image_tag
  providers = {
    helm       = helm.enteprise-6y33t
    kubernetes = kubernetes.enteprise-6y33t
  }
}
