resource "kubernetes_deployment_v1" "ui" {
  metadata {
    name = "ui-deployment"
  }

  spec {
    selector {
      match_labels = {
        app = "ui-service"
      }
    }

    template {
      metadata {
        labels = {
          app = "ui-service"
        }
      }

      spec {
        container {
          image             = "europe-west4-docker.pkg.dev/cloud-porsche/cloud-porsche/ui:latest"
          name              = "ui"
          image_pull_policy = "IfNotPresent"

          port {
            container_port = 8080
          }

          security_context {
            allow_privilege_escalation = false
            privileged                 = false
            read_only_root_filesystem  = false

            capabilities {
              add = []
              drop = ["NET_RAW"]
            }
          }

          liveness_probe {
            http_get {
              host = "localhost"
              path = "/"
              port = "80"
            }

            initial_delay_seconds = 3
            period_seconds        = 3
          }
        }

        security_context {
          run_as_non_root = true

          seccomp_profile {
            type = "RuntimeDefault"
          }
        }

        # Toleration is currently required to prevent perpetual diff:
        # https://github.com/hashicorp/terraform-provider-kubernetes/pull/2380
        toleration {
          effect   = "NoSchedule"
          key      = "kubernetes.io/arch"
          operator = "Equal"
          value    = "amd64"
        }
      }
    }
  }
}

resource "kubernetes_service_v1" "ui" {
  metadata {
    name = "ui-service"
    annotations = {
      "networking.gke.io/load-balancer-type" = "Internal" # Remove to create an external loadbalancer
    }
  }

  spec {
    selector = {
      app = kubernetes_deployment_v1.ui.spec[0].selector[0].match_labels.app
    }

    port {
      port        = 80
      target_port = kubernetes_deployment_v1.ui.spec[0].template[0].spec[0].container[0].port[0].name
    }

    type = "LoadBalancer"
  }

  depends_on = [time_sleep.wait_service_cleanup]
}
