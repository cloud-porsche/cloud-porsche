### Cluster Configuration
resource "google_container_cluster" "enterprise_tenant" {
  name = var.tenant_id

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
  name       = var.tenant_id
  repository = "oci://europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/"
  timeout    = 900

  values = compact([
    file("${path.module}/../../k8s/helm/cloud-porsche-default/values.yaml"),
      fileexists("${path.module}/../../k8s/helm/cloud-porsche-default/values-secrets.yaml") ?
      file("${path.module}/../../k8s/helm/cloud-porsche-default/values-secrets.yaml") : null,
      fileexists("${path.module}/../../k8s/helm/cloud-porsche-default/values-${var.tenant_id}.yaml") ?
      file("${path.module}/../../k8s/helm/cloud-porsche-default/values-${var.tenant_id}.yaml") : null,
  ])

  set {
    name  = "images.propertyManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/property-management:latest"
  }
  set_sensitive {
    name  = "secrets.FIREBASE_CLIENT_EMAIL"
    value = google_service_account.tenant_service_account.email
  }
  set_sensitive {
    name  = "secrets.FIREBASE_PRIVATE_KEY"
    value = jsondecode(base64decode(google_service_account_key.tenant_service_account_key.private_key)).private_key
  }
  set_sensitive {
    name  = "secrets.FIREBASE_TOKEN"
    value = var.firebase_token
  }
}
