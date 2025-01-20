variable "tenant_id" {
  type        = string
  description = "The gcloud tenant id"
  nullable    = false
}

variable "tenant_name" {
  type        = string
  description = "The tenant display name"
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

variable "admin_email" {
  type        = string
  description = "The email of the admin"
  nullable    = false
}

variable "image_tag" {
  type        = string
  description = "The image tag"
  default     = "latest"
  nullable    = false
}

variable "free_tier_overwrite" {
  type        = bool
  description = "Overwrite the tier info to free tier"
  default     = false
  nullable    = false
}

variable "prod" {
  type        = bool
  description = "Is this a prod environment"
  default     = false
  nullable    = false
}

variable "enableTenantInfo" {
  type        = bool
  description = "Enable tenant info"
  default     = true
  nullable    = false
}
