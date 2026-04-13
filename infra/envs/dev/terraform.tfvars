# Development environment configuration for secure-systems-frontend

environment       = "dev"
region            = "us-east-2"
project_name      = "ia-arch-analyzer"
app_name          = "secure-systems"
enable_cloudfront = true
enable_ecr        = true

# Development has shorter cache TTLs for frequent updates
cloudfront_ttl = 300  # 5 minutes
cache_max_ttl  = 3600 # 1 hour

ecr_scan_on_push = true


