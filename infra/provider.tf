provider "aws" {
  region = var.region

  default_tags {
    tags = local.common_tags
  }
}

# Provider for us-east-1 (required for Lambda@Edge)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = local.common_tags
  }
}
