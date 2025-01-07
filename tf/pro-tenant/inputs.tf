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

variable "admin_email" {
  type        = string
  description = "The email of the admin"
  nullable    = false
}

variable "pro_ip" {
  type        = string
  description = "The ip address of pro-tier tenant cluster"
  nullable    = false
}
