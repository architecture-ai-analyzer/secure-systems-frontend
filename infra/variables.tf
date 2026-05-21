variable "region" {
  description = "AWS region"
  type        = string
  default     = "us-east-2"
}

variable "environment" {
  description = "Environment name (dev, homologation, production)"
  type        = string
  default     = "dev"

  validation {
    condition     = contains(["dev", "homologation", "production"], var.environment)
    error_message = "Environment must be dev, homologation, or production."
  }
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ia-arch-analyzer"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "secure-systems"
}

variable "enable_cloudfront" {
  description = "Enable CloudFront distribution for content delivery"
  type        = bool
  default     = true
}

variable "cloudfront_ttl" {
  description = "CloudFront default TTL in seconds"
  type        = number
  default     = 3600

  validation {
    condition     = var.cloudfront_ttl >= 0 && var.cloudfront_ttl <= 31536000
    error_message = "CloudFront TTL must be between 0 and 31536000 seconds."
  }
}

variable "cache_max_ttl" {
  description = "CloudFront maximum TTL in seconds"
  type        = number
  default     = 31536000

  validation {
    condition     = var.cache_max_ttl >= var.cloudfront_ttl
    error_message = "Cache max TTL must be greater than or equal to default TTL."
  }
}

variable "enable_ecr" {
  description = "Enable ECR repository for container images"
  type        = bool
  default     = false
}

variable "ecr_scan_on_push" {
  description = "Enable ECR image scanning on push"
  type        = bool
  default     = true
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default = {
    Repository = "secure-systems-frontend"
    ManagedBy  = "Terraform"
  }
}
