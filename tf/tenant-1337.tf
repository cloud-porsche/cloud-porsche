provider "helm" {
  alias = "tenant-1337"
  kubernetes {
    host  = "https://${module.tenant-1337.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.tenant-1337.client_certificate)
    client_key = base64decode(module.tenant-1337.client_key)
    cluster_ca_certificate = base64decode(module.tenant-1337.cluster_ca_certificate)
  }
}

module "tenant-1337" {
  source         = "./enterprise-tenant"
  tenant_id      = "tenant-1337"
  firebase_token = var.firebase_token
  providers = {
    helm = helm.tenant-1337
  }
}
