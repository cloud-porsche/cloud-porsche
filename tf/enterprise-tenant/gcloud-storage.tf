resource "google_firestore_database" "enterprise_tenant_property_management" {
  location_id      = var.location
  name             = "property-management-${var.tenant_id}${var.prod ? "" : "-staging"}"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "PESSIMISTIC"
  project          = "cloud-porsche"
  deletion_policy  = var.prod ? "ABANDON" : "DELETE"
}

resource "google_firestore_database" "enterprise_tenant_monitoring" {
  location_id      = var.location
  name             = "monitoring-${var.tenant_id}${var.prod ? "" : "-staging"}"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "PESSIMISTIC"
  project          = "cloud-porsche"
  deletion_policy  = var.prod ? "ABANDON" : "DELETE"
}

resource "google_firestore_backup_schedule" "weekly-backup" {
  project = "cloud-porsche"
  for_each = toset([
    google_firestore_database.enterprise_tenant_property_management.name,
    google_firestore_database.enterprise_tenant_monitoring.name
  ])
  database = each.value

  retention = "8467200s" // 14 weeks (maximum possible retention)

  weekly_recurrence {
    day = "SUNDAY"
  }
}

resource "google_storage_bucket" "enterprise_tenant" {
  location      = var.location
  name          = "property-management-${var.tenant_id}${var.prod ? "" : "-staging"}"
  force_destroy = var.prod ? false : true
}

resource "google_pubsub_topic" "enterprise_queue" {
  name = "${var.tenant_id}${var.prod ? "" : "-staging"}-queue"
}

resource "google_pubsub_subscription" "enterprise_subscription" {
  name  = "${var.tenant_id}${var.prod ? "" : "-staging"}-subscription"
  topic = google_pubsub_topic.enterprise_queue.name
}
