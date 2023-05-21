#!/bin/bash
set -euo pipefail

# Unset AWS env vars from pipeline and use default profile
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Variables from pipeline
ecr_repo=$3
account_region=$2
account_name=$1
account_id=0
branch=$CI_COMMIT_BRANCH


# Map aws account id
case $account_name in
  myria-sandbox)
    account_id=367745696482
    ;;

  myria-net-nonprod)
    account_id=423125429807
    ;;

  myria-net-prod)
    account_id=233573962028
    ;;

  *)
    exit 1
    ;;
esac

# Authenticate ECR
aws ecr get-login-password --region ${account_region} | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${account_region}.amazonaws.com

if [[ "$branch" == *"release/"* ]]; then
  # Release/prod branch

  # release/v1.0.0 -> v1.0.0
  semantic_version=${branch#*/}
  docker build -t ${ecr_repo}:latest -t ${ecr_repo}:${semantic_version} .

  docker tag ${ecr_repo}:${semantic_version} ${account_id}.dkr.ecr.${account_region}.amazonaws.com/${ecr_repo}:${semantic_version}
  
  docker push ${account_id}.dkr.ecr.${account_region}.amazonaws.com/${ecr_repo}:${semantic_version}
else
  # Dev and Staging branch
  docker build -t ${ecr_repo}:latest .

  docker tag ${ecr_repo}:latest ${account_id}.dkr.ecr.${account_region}.amazonaws.com/${ecr_repo}:latest

  docker push ${account_id}.dkr.ecr.${account_region}.amazonaws.com/${ecr_repo}:latest
fi
