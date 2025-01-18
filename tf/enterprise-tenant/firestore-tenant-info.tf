resource "google_firestore_document" "tenant_info" {
  collection  = "Tenants"
  database    = "(default)"
  document_id = var.tenant_id == "free-tier" ? var.prod ? "free-tier" : "free" : var.tenant_id
  fields      = "{\"tenantId\":{\"stringValue\":\"${var.tenant_id}\"},\"tenantName\":{\"stringValue\":\"${var.tenant_name}\"},\"tier\":{\"integerValue\":\"${var.free_tier_overwrite ? 0 : 2}\"},\"adminEmail\":{\"stringValue\":\"${var.admin_email}\"},\"ip\":{\"stringValue\":\"${trimsuffix(google_dns_record_set.tenant_domain.name, ".")}\"}}"
}
