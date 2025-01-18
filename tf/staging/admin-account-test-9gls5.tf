provider "helm" {
  alias = "admin-account-test-9gls5"
  kubernetes {
    host  = "https://${module.admin-account-test-9gls5.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.admin-account-test-9gls5.client_certificate)
    client_key = base64decode(module.admin-account-test-9gls5.client_key)
    cluster_ca_certificate = base64decode(module.admin-account-test-9gls5.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  alias = "admin-account-test-9gls5"
  host  = "https://${module.admin-account-test-9gls5.cluster_endpoint}"
  token = data.google_client_config.default.access_token
  client_certificate = base64decode(module.admin-account-test-9gls5.client_certificate)
  client_key = base64decode(module.admin-account-test-9gls5.client_key)
  cluster_ca_certificate = base64decode(module.admin-account-test-9gls5.cluster_ca_certificate)
}

module "admin-account-test-9gls5" {
  source         = "../enterprise-tenant"
  tenant_id      = "admin-account-test-9gls5"
  tenant_name    = "Admin Account Test"
  firebase_token = var.firebase_token
  location       = "europe-north1"
  admin_email    = "osi.borkenhagen@gmail.com"
  image_tag      = var.image_tag
  providers = {
    helm       = helm.admin-account-test-9gls5
    kubernetes = kubernetes.admin-account-test-9gls5
  }
}
