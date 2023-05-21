data "aws_vpc" "myria_vpc" {
  filter {
    name   = "tag:Name"
    values = ["myria-vpc"]
  }
}

data "aws_subnets" "private_subnets" {
  filter {
    name   = "tag:Name"
    values = ["private-subnet"]
  }
}

data "aws_subnets" "public_subnets" {
  filter {
    name   = "tag:Name"
    values = ["public-subnet"]
  }
}

data "aws_caller_identity" "current" {}

# Deployed via myria-services-infra repo
data "aws_resourcegroupstaggingapi_resources" "alb_node_tg_resources" {
  resource_type_filters = ["elasticloadbalancing:targetgroup"]

  tag_filter {
    key    = "Services"
    values = ["Node"]
  }

  tag_filter {
    # prod-v1-0 -> prod
    key    = "Stage"
    values = [regex("[a-z]+", var.stage)] # [dev, staging, prod]
  }
}

data "aws_lb_target_group" "alb_node_tg" {
  arn = data.aws_resourcegroupstaggingapi_resources.alb_node_tg_resources.resource_tag_mapping_list[0].resource_arn
}

data "aws_lb" "alb" {
  name = "myriaverse-api-node-${local.trimmed_stage}"
}

data "aws_lb_listener" "alb_default_listener" {
  load_balancer_arn = data.aws_lb.alb.arn
  port              = 80 # Internal ALB only open HTTP 80
}