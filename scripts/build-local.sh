#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT=${1:-dev}
AWS_REGION=${2:-us-east-2}
SAVE_DIR=$(pwd)

cd infra

# Inicializa o backend do frontend usando o state bucket do Terraform
terraform init \
  -backend-config="bucket=tf-state-ai-architecture-analyzer" \
  -backend-config="region=${AWS_REGION}" \
  -backend-config="key=v1/frontend/${ENVIRONMENT}/terraform.tfstate" \
  -upgrade

# Lê a URL do gateway a partir do output remoto do Terraform
GATEWAY_API_BASE_URL=$(terraform output -var="environment=${ENVIRONMENT}" -raw gateway_api_base_url)

echo "Gateway API URL: ${GATEWAY_API_BASE_URL}"

echo "Building frontend with VITE_API_URL=${GATEWAY_API_BASE_URL}"
cd "${SAVE_DIR}"

VITE_API_URL="${GATEWAY_API_BASE_URL}" npm run build
