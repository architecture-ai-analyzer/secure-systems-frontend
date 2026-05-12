locals {
  # Naming conventions following the pattern: {project}-{app}-{component}-{environment}
  s3_bucket_name      = "${var.project_name}-${var.app_name}-frontend-${var.environment}"
  cloudfront_comment  = "CDN for ${var.app_name} - ${var.environment}"

  # Common tags applied to all resources
  common_tags = merge(
    var.tags,
    {
      Environment = var.environment
      Application = var.app_name
      Project     = var.project_name
      CreatedAt   = timestamp()
    }
  )
}
