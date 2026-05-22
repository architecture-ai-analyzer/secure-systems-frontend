#!/usr/bin/env bash
set -euo pipefail

# Use command-line arguments passed by Terraform
ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-2}
GATEWAY_API_BASE_URL=${3}
S3_BUCKET_NAME=${4}
CLOUDFRONT_DISTRIBUTION_ID=${5}

# Detect if we're in the infra directory or project root
if [ -f "backend.tf" ]; then
  # We're in the infra directory
  SCRIPT_DIR=$(pwd)
  PROJECT_ROOT=$(dirname "${SCRIPT_DIR}")
  cd "${PROJECT_ROOT}"
else
  # We're in the project root
  PROJECT_ROOT=$(pwd)
fi

echo "Environment: ${ENVIRONMENT}"
echo "AWS Region: ${AWS_REGION}"
echo "Gateway API URL: ${GATEWAY_API_BASE_URL}"
echo "S3 Bucket: ${S3_BUCKET_NAME}"
echo "CloudFront Distribution ID: ${CLOUDFRONT_DISTRIBUTION_ID}"

# Build the frontend with VITE_API_URL
echo "Building frontend with VITE_API_URL=${GATEWAY_API_BASE_URL}"
VITE_API_URL="${GATEWAY_API_BASE_URL}" npm run build

echo "Uploading to S3 bucket: ${S3_BUCKET_NAME}"

# Sync the built files to S3
aws s3 sync dist/ "s3://${S3_BUCKET_NAME}" --delete --region "${AWS_REGION}"

echo "Invalidating CloudFront cache for distribution: ${CLOUDFRONT_DISTRIBUTION_ID}"

# Create CloudFront invalidation
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*" \
  --region "${AWS_REGION}"

echo "Deployment completed successfully!"
