# Homologation environment configuration for secure-systems-frontend

environment       = "homologation"
region            = "us-east-2"
project_name      = "ia-arch-analyzer"
app_name          = "secure-systems"
enable_cloudfront = true
enable_ecr        = true

# Homologation has moderate cache TTLs for testing and stability
cloudfront_ttl = 1800  # 30 minutes
cache_max_ttl  = 86400 # 1 day

ecr_scan_on_push = true

