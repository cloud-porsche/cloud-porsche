provider "helm" {
  alias = "iam19characterslong-dlivd"
  kubernetes {
    host  = "https://${module.iam19characterslong-dlivd.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.iam19characterslong-dlivd.client_certificate)
    client_key = base64decode(module.iam19characterslong-dlivd.client_key)
    cluster_ca_certificate = base64decode(module.iam19characterslong-dlivd.cluster_ca_certificate)
  }
}

module "iam19characterslong-dlivd" {
  source         = "./enterprise-tenant"
  tenant_id      = "iam19characterslong-dlivd"
  firebase_token = var.firebase_token
  location       = "europe-west4"
  image_tag      = var.image_tag
  providers = {
    helm = helm.iam19characterslong-dlivd
  }
}
