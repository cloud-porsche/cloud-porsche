variable "firebase_token" {
  type        = string
  description = "The firebase token"
  sensitive   = true
  nullable    = false
}

variable "image_tag" {
  type        = string
  description = "The image tag"
  default     = "latest"
  nullable    = false
}
