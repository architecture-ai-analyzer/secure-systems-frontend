resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI for ${var.app_name} frontend access to S3"
}

resource "aws_cloudfront_distribution" "frontend" {
  enabled             = true
  default_root_object = "index.html"
  comment             = local.cloudfront_comment
  is_ipv6_enabled     = true
  price_class         = "PriceClass_100" # US, EU, Hong Kong

  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3Frontend"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Frontend"

    compress = true

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = var.cloudfront_ttl
    max_ttl                = var.cache_max_ttl

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }
  }

  # Cache for static assets (JS, CSS, images)
  ordered_cache_behavior {
    path_pattern     = "/assets/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3Frontend"

    compress = true

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 31536000 # 1 year
    max_ttl                = 31536000

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }
  }

  # SPA routing: handle 404 errors by serving index.html
  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags

  depends_on = [aws_s3_bucket_policy.frontend]
}

# resource "aws_cloudfront_invalidation" "frontend" {
#   distribution_id = aws_cloudfront_distribution.frontend.id

#   paths = [
#     "/*"
#   ]

#   depends_on = [aws_cloudfront_distribution.frontend]

#   lifecycle {
#     create_before_destroy = true
#   }
# }
