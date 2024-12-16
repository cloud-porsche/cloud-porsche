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

resource "helm_release" "default" {
  chart      = "cloud-porsche-default"
  name       = "cloud-porsche-default"
  repository = "oci://europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/"

  values = [
    file("${path.module}/../k8s/helm/cloud-porsche-default/values.yaml"),
      fileexists("${path.module}/../k8s/helm/cloud-porsche-default/values-secrets.yaml") ?
      file("${path.module}/../k8s/helm/cloud-porsche-default/values-secrets.yaml") : null
  ]

  set {
    name  = "images.propertyManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/property-management:latest"
  }
}
