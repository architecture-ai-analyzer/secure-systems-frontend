terraform {
  backend "s3" {
    bucket = "tf-state-ai-architecture-analyzer"
    key    = "v1/frontend/dev/terraform.tfstate"
    region = "us-east-2"
  }

  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
