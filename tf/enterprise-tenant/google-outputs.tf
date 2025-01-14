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

output "ingress_ip" {
  depends_on = [
    helm_release.enterprise_tenant, data.kubernetes_service.ingress, google_container_cluster.enterprise_tenant
  ]
  value = data.kubernetes_service.ingress.status[0].load_balancer[0].ingress[0].ip
}

output "ingress_hostname" {
  depends_on = [
    helm_release.enterprise_tenant, data.kubernetes_service.ingress, google_container_cluster.enterprise_tenant,
    google_dns_record_set.tenant_domain
  ]
  value = trimsuffix(google_dns_record_set.tenant_domain.name, ".")
}
