terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.15"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.17"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.35"
    }
  }
}

resource "google_service_account" "tenant_service_account" {
  account_id                   = var.tenant_id
  description                  = "Tenant Service account"
  display_name                 = var.tenant_id
  project                      = "cloud-porsche"
  create_ignore_already_exists = true
}

resource "google_service_account_key" "tenant_service_account_key" {
  service_account_id = google_service_account.tenant_service_account.name
}

resource "google_project_iam_member" "service_account_iam_datastore" {
  project = "cloud-porsche"
  role    = "roles/datastore.owner"
  member  = "serviceAccount:${google_service_account.tenant_service_account.email}"
  depends_on = [google_service_account.tenant_service_account]
}

resource "google_project_iam_member" "service_account_iam_storage" {
  project = "cloud-porsche"
  role    = "roles/storage.admin"
  member  = "serviceAccount:${google_service_account.tenant_service_account.email}"
  depends_on = [google_service_account.tenant_service_account]
}

resource "google_project_iam_member" "service_account_iam_pubsub" {
  project = "cloud-porsche"
  role    = "roles/pubsub.admin"
  member  = "serviceAccount:${google_service_account.tenant_service_account.email}"
  depends_on = [google_service_account.tenant_service_account]
}
