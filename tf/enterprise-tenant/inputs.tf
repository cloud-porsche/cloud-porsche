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
