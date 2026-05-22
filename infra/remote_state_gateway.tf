data "terraform_remote_state" "gateway" {
  backend = "s3"

  config = {
    bucket  = "tf-state-ai-architecture-analyzer"
    key     = "v1/gateway/${var.environment}/terraform.tfstate"
    region  = var.region
    encrypt = true
  }
}
