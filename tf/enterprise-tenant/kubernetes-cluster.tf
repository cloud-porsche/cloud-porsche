resource "cloudflare_record" "tenant_ingress" {
  zone_id = "c087a43517ba91fb09df4beffb7948d7"
  name    = "${var.tenant_id}.ostabo.com"
  type    = "A"
  content = data.kubernetes_service.ingress.status.0.load_balancer.0.ingress.0.ip
  proxied = true
}

### Cluster Configuration
resource "google_container_cluster" "enterprise_tenant" {
  name = var.tenant_id

  location                 = var.location
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
    file("${path.module}/../../helm/cloud-porsche-default/values.yaml"),
      fileexists("${path.module}/../../helm/cloud-porsche-default/values-secrets.yaml") ?
      file("${path.module}/../../helm/cloud-porsche-default/values-secrets.yaml") : null,
      fileexists("${path.module}/../../helm/cloud-porsche-default/values-${var.tenant_id}.yaml") ?
      file("${path.module}/../../helm/cloud-porsche-default/values-${var.tenant_id}.yaml") : null,
  ])

  set {
    name  = "images.propertyManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/property-management:${var.image_tag}"
  }
  set {
    name  = "images.parkingManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/parking-management:${var.image_tag}"
  }
  set {
    name  = "images.monitoringManagement"
    value = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/monitoring-management:${var.image_tag}"
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

data "kubernetes_service" "ingress" {
  depends_on = [helm_release.enterprise_tenant, google_container_cluster.enterprise_tenant]
  metadata {
    name = "${var.tenant_id}-ingress-nginx-controller"
  }
}
