# Myria accounts information
variable "accounts" {
  type = map(string)
  description = "Myria AWS accounts information - DON'T change"
  default = {
    "myria-net-nonprod" = "423125429807"
    "myria-net-prod"    = "233573962028"
    "myria-sandbox"     = "367745696482"
  }
}

locals {
  # Default Tags applying to all resources
  common_tags     = {
     Application    = "${var.repository}"
     Branch         = "${var.branch}"
     LineOfBusiness = "Myriaverse"
     Terraform      = "true"
  }

  # e.g. [dev, staging, prod]
  trimmed_stage = regex("[a-z]+", var.stage)
}

# Variables injected from pipeline
variable "account" {
  type        = string
  description = "Myria well-defined account name"
  default     = "myria-sandbox"
}

variable "stage" {
  type        = string
  description = "Deployment stage. e.g. [dev, staging, prod-v1-0-0, prod-v1-0-2]. Use local.trimmed_stage for stage without release versions."
  default     = "dev"
}

variable "region" {
  type        = string
  description = "AWS account region"
  default     = "us-east-1"
}

variable "branch" {
  type        = string
  description = "$CI_COMMIT_BRANCH - The commit branch name. Not available in merge request pipelines or tag pipelines."
  default     = "unknown"
}

variable "repository" {
  type        = string
  description = "$CI_PROJECT_NAME - The name of the directory for the project."
  default     = "unknown"
}

variable "image_tag" {
  type        = string
  description = "ECS image tag. Release branch [prod-v1-0-0] -> v1.0.0"
  default     = "latest"
}

# Assume and deploy to correct account
provider "aws" {
  region = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::${var.accounts[var.account]}:role/DeployerRole"
  }
}

# Bucket info are defined in pipeline
terraform {
  backend "s3" {}
}

# Customised variables
variable "application" {
  type        = string
  description = "This application name"
  default     = "myriaverse-services-node"
}

# Outputs
output "local_trimmed_stage" {
  value       = local.trimmed_stage
  description = "Trimmed stage, e.g. [dev, staging, prod]"
}

output "var_image_tag" {
  value       = var.image_tag
  description = "Image tag e.g. [latest, v1.0.0, v1.0.1]"
}
