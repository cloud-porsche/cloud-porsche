resource "google_dns_record_set" "tenant_domain" {
  name = "${var.tenant_id}${var.prod ? "" : "-staging"}.cloud-porsche.com."
  type = "A"
  ttl  = 300

  managed_zone = "cloud-porsche-com"

  rrdatas = [data.kubernetes_service.ingress.status[0].load_balancer[0].ingress[0].ip]
}

resource "kubernetes_secret" "google-credentials" {
  depends_on = [google_service_account_key.tenant_service_account_key, helm_release.cert_manager]
  metadata {
    name      = "google-credentials"
    namespace = "cert-manager"
  }
  data = {
    "key.json" = base64decode(google_service_account_key.tenant_service_account_key.private_key)
  }
}

### Cluster Configuration
resource "google_container_cluster" "enterprise_tenant" {
  name = "${var.tenant_id}${var.prod ? "" : "-staging"}"

  location = var.location

  initial_node_count       = 1
  remove_default_node_pool = true

  service_external_ips_config {
    enabled = false
  }

  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }
  cost_management_config {
    enabled = true
  }
  node_config {
    disk_size_gb = 20
  }
  cluster_autoscaling {
    auto_provisioning_defaults {
      disk_size = 20
      management {
        auto_repair  = true
        auto_upgrade = true
      }
    }
    resource_limits {
      resource_type = "cpu"
      minimum       = 1
      maximum       = 12
    }
    resource_limits {
      resource_type = "memory"
      minimum       = 1
      maximum       = 32
    }
    enabled = true
  }
  master_auth {
    client_certificate_config {
      issue_client_certificate = false
    }
  }

  deletion_protection = false
}

resource "helm_release" "cert_manager" {
  name             = "cert-manager"
  repository       = "https://charts.jetstack.io"
  chart            = "cert-manager"
  namespace        = "cert-manager"
  create_namespace = true
  timeout          = 600
  wait_for_jobs    = true

  set {
    name  = "crds.enabled"
    value = "true"
  }
  set {
    name  = "global.leaderElection.namespace"
    value = "cert-manager"
  }
}

resource "helm_release" "enterprise_tenant" {
  depends_on = [helm_release.cert_manager]
  chart         = "cloud-porsche-default"
  name          = "${var.tenant_id}${var.prod ? "" : "-staging"}"
  repository    = "oci://europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/"
  timeout       = 900
  wait_for_jobs = true

  version = "0.6.2" # Set this when changing helm chart

  values = compact([
    file("${path.module}/../../helm/cloud-porsche-default/values.yaml"),
      fileexists("${path.module}/../../helm/cloud-porsche-default/values-secrets.yaml") ?
      file("${path.module}/../../helm/cloud-porsche-default/values-secrets.yaml") : null,
      fileexists("${path.module}/../../helm/cloud-porsche-default/values-${var.tenant_id}${var.prod ? "" : "-staging"}.yaml")
      ?
      file("${path.module}/../../helm/cloud-porsche-default/values-${var.tenant_id}${var.prod ? "" : "-staging"}.yaml")
      : null,
  ])

  set {
    name  = "global.leaderElection.namespace"
    value = "cert-manager"
  }
  set {
    name  = "certificateUrl"
    value = "https://acme-${var.prod ? "" : "staging-"}v02.api.letsencrypt.org/directory"
  }

  set {
    name  = "tenantId"
    value = "${var.tenant_id}${var.prod ? "" : "-staging"}"
  }
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
    name = "${var.tenant_id}${var.prod ? "" : "-staging"}-ingress-nginx-controller"
  }
}
