variable "tenant_id" {
  type        = string
  description = "The gcloud tenant id"
  nullable    = false
}

variable "firebase_token" {
  type        = string
  description = "The firebase token"
  sensitive   = true
  nullable    = false
}

variable "location" {
  type        = string
  description = "The location of the resources"
  default     = "europe-west4"
  nullable    = false
}

variable "image_tag" {
  type        = string
  description = "The image tag"
  default     = "latest"
  nullable    = false
}
