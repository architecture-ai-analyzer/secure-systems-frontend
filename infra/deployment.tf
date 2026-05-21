# Null resource to trigger frontend build and deployment
resource "null_resource" "frontend_deploy" {
  triggers = {
    gateway_url = data.terraform_remote_state.gateway.outputs.api_base_url
    # Add a timestamp to force redeployment when needed
    timestamp = timestamp()
  }

  provisioner "local-exec" {
    command = "powershell -ExecutionPolicy Bypass -File ${path.module}/../scripts/deploy.ps1 -Environment ${var.environment} -Region ${var.region} -GatewayUrl '${data.terraform_remote_state.gateway.outputs.api_base_url}' -S3Bucket '${data.aws_s3_bucket.frontend.id}' -CloudFrontId '${aws_cloudfront_distribution.frontend.id}'"
    working_dir = path.module
  }

  depends_on = [
    aws_s3_bucket_policy.frontend,
    aws_cloudfront_distribution.frontend
  ]
}

