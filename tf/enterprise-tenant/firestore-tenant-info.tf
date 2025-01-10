resource "google_firestore_document" "tenant_info" {
  collection  = "Tenants"
  database    = "(default)"
  document_id = var.tenant_id
  fields      = "{\"tenantId\":{\"stringValue\":\"${var.tenant_id}\"},\"tenantName\":{\"stringValue\":\"${var.tenant_name}\"},\"tier\":{\"integerValue\":\"2\"},\"adminEmail\":{\"stringValue\":\"${var.admin_email}\"},\"ip\":{\"stringValue\":\"${google_dns_record_set.tenant_domain.name}\"}}"
}
