output "s3_bucket_name" {
  description = "Name of the S3 bucket for frontend assets"
  value       = data.aws_s3_bucket.frontend.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = data.aws_s3_bucket.frontend.arn
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID for cache invalidation"
  value       = aws_cloudfront_distribution.frontend.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name (e.g., d123abc.cloudfront.net)"
  value       = aws_cloudfront_distribution.frontend.domain_name
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.frontend.arn
}

output "cloudfront_oai_id" {
  description = "CloudFront Origin Access Identity ID"
  value       = aws_cloudfront_origin_access_identity.oai.id
}

output "gateway_api_base_url" {
  description = "API Gateway base URL for backend communication"
  value       = data.terraform_remote_state.gateway.outputs.api_base_url
}

output "frontend_url" {
  description = "Complete URL to access the frontend application"
  value       = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}
