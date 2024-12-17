resource "google_firestore_database" "enterprise_tenant" {
  location_id             = "europe-west4"
  name                    = "property-management-${var.tenant_id}"
  type                    = "FIRESTORE_NATIVE"
  concurrency_mode        = "PESSIMISTIC"
  project                 = "cloud-porsche"
  delete_protection_state = "DELETE"
}

resource "google_storage_bucket" "enterprise_tenant" {
  location = "europe-west4"
  name     = "property-management-${var.tenant_id}"
}
