output "cluster_endpoint" {
  depends_on = [google_container_cluster.enterprise_tenant]
  value = google_container_cluster.enterprise_tenant.endpoint
}

output "cluster_ca_certificate" {
  depends_on = [google_container_cluster.enterprise_tenant]
  value = google_container_cluster.enterprise_tenant.master_auth[0].cluster_ca_certificate
}

output "client_certificate" {
  depends_on = [google_container_cluster.enterprise_tenant]
  value = google_container_cluster.enterprise_tenant.master_auth[0].client_certificate
}

output "client_key" {
  depends_on = [google_container_cluster.enterprise_tenant]
  value = google_container_cluster.enterprise_tenant.master_auth[0].client_key
}
