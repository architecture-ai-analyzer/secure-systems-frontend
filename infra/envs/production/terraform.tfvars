# Production environment configuration for secure-systems-frontend

environment       = "production"
region            = "us-east-2"
project_name      = "ia-arch-analyzer"
app_name          = "secure-systems"
enable_cloudfront = true
enable_ecr        = true

# Production has longer cache TTLs for performance and cost optimization
cloudfront_ttl = 3600     # 1 hour
cache_max_ttl  = 31536000 # 1 year (for versioned assets)

ecr_scan_on_push = true

