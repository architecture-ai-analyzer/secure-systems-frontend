param(
    [string]$Environment = "dev",
    [string]$Region = "us-east-2",
    [string]$GatewayUrl,
    [string]$S3Bucket,
    [string]$CloudFrontId
)

# Remove any extra quotes from parameters
$GatewayUrl = $GatewayUrl.Trim('"', "'")
$S3Bucket = $S3Bucket.Trim('"', "'")
$CloudFrontId = $CloudFrontId.Trim('"', "'")

# Detect if we're in the infra directory or project root
if (Test-Path "backend.tf") {
    # We're in the infra directory
    $ScriptDir = Get-Location
    $ProjectRoot = Split-Path $ScriptDir -Parent
    Set-Location $ProjectRoot
} else {
    # We're in the project root
    $ProjectRoot = Get-Location
}

Write-Host "Environment: $Environment"
Write-Host "AWS Region: $Region"
Write-Host "Gateway API URL: $GatewayUrl"
Write-Host "S3 Bucket: $S3Bucket"
Write-Host "CloudFront Distribution ID: $CloudFrontId"

# Build the frontend with VITE_API_URL
Write-Host "Building frontend with VITE_API_URL=$GatewayUrl"
$env:VITE_API_URL = $GatewayUrl
npm run build

Write-Host "Uploading to S3 bucket: $S3Bucket"

# Sync the built files to S3
aws s3 sync dist/ "s3://$S3Bucket" --delete --region $Region

Write-Host "Invalidating CloudFront cache for distribution: $CloudFrontId"

# Create CloudFront invalidation
aws cloudfront create-invalidation `
  --distribution-id $CloudFrontId `
  --paths "/*" `
  --region $Region

Write-Host "Deployment completed successfully!"
