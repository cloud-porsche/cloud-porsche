terraform {
  required_version = ">= 1.0.0" # Ensure that the Terraform version is 1.0.0 or higher

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

  backend "gcs" {
    bucket = "cloud-porsche-terraform"
    prefix = "terraform"
  }
}

provider "google" {
  project = "cloud-porsche"
  region  = "europe-west4"
}

data "google_client_config" "default" {}
