terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.12"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.16"
    }
  }
}

### Cluster Configuration
resource "google_container_cluster" "enterprise_tenant" {
  name = "cloud-porsche-${var.tenant_id}"

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

resource "helm_release" "enterprise_tenant" {
  chart      = "cloud-porsche-default"
  name       = "cloud-porsche-${var.tenant_id}"
  repository = "oci://europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/"

  values = [
    file("${path.module}/../../k8s/helm/cloud-porsche-default/values.yaml"),
      fileexists("${path.module}/../../k8s/helm/cloud-porsche-default/values-secrets.yaml") ?
      file("${path.module}/../../k8s/helm/cloud-porsche-default/values-secrets.yaml") : null,
      fileexists("${path.module}/../../k8s/helm/cloud-porsche-default/values-${var.tenant_id}.yaml") ?
      file("${path.module}/../../k8s/helm/cloud-porsche-default/values-${var.tenant_id}.yaml") : null,
  ]

  set {
    name  = "images.propertyManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/property-management:latest"
  }
}
