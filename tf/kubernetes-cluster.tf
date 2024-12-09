### Cluster Configuration
resource "google_container_cluster" "default" {
  name = "cloud-porsche-autopilot-cluster"

  location                 = "europe-west4"
  enable_autopilot         = true
  enable_l4_ilb_subsetting = true

  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  deletion_protection = false
}

### Kubernetes Configuration
data "google_client_config" "default" {}

provider "kubernetes" {
  host  = "https://${google_container_cluster.default.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth[0].cluster_ca_certificate)

  ignore_annotations = [
    "^autopilot\\.gke\\.io\\/.*",
    "^cloud\\.google\\.com\\/.*"
  ]
}

# Provide time for Service cleanup
resource "time_sleep" "wait_service_cleanup" {
  depends_on = [google_container_cluster.default]

  destroy_duration = "180s"
}
