provider "helm" {
  alias = "test-1c3gr"
  kubernetes {
    host  = "https://${module.test-1c3gr.cluster_endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(module.test-1c3gr.client_certificate)
    client_key = base64decode(module.test-1c3gr.client_key)
    cluster_ca_certificate = base64decode(module.test-1c3gr.cluster_ca_certificate)
  }
}

module "test-1c3gr" {
  source         = "./enterprise-tenant"
  tenant_id      = "test-1c3gr"
  firebase_token = var.firebase_token
  providers = {
    helm = helm.test-1c3gr
  }
}
