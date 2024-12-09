terraform {
  required_version = ">= 1.0.0" # Ensure that the Terraform version is 1.0.0 or higher

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 6.12"
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
