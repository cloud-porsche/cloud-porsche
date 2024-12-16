terraform {
  required_version = ">= 1.0.0" # Ensure that the Terraform version is 1.0.0 or higher

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.12"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.16"
    }
  }

  backend "gcs" {
    bucket = "cloud-porsche-terraform"
    prefix = "terraform"
  }
}

provider "google" {
  project = "cloud-porsche"
  region  = "europe-west4"
}

provider "helm" {
  kubernetes {
    host  = "https://${google_container_cluster.default.endpoint}"
    token = data.google_client_config.default.access_token
    client_certificate = base64decode(google_container_cluster.default.master_auth.0.client_certificate)
    client_key = base64decode(google_container_cluster.default.master_auth.0.client_key)
    cluster_ca_certificate = base64decode(google_container_cluster.default.master_auth.0.cluster_ca_certificate)
  }
}
