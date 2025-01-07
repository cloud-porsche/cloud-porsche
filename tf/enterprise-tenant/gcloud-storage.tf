resource "google_firestore_database" "enterprise_tenant_property_management" {
  location_id      = var.location
  name             = "property-management-${var.tenant_id}"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "PESSIMISTIC"
  project          = "cloud-porsche"
  deletion_policy  = "DELETE"
}

resource "google_firestore_database" "enterprise_tenant_monitoring" {
  location_id      = var.location
  name             = "monitoring-${var.tenant_id}"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "PESSIMISTIC"
  project          = "cloud-porsche"
  deletion_policy  = "DELETE"
}

resource "google_storage_bucket" "enterprise_tenant" {
  location = var.location
  name     = "property-management-${var.tenant_id}"
}
