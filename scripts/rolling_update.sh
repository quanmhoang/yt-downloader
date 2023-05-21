#!/bin/bash
set -euo pipefail

# Unset AWS env vars from pipeline and use default profile
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Variables from pipeline
region=$1
ecs_cluster_name=$2
ecs_service_name=$3
branch=$4

# Add the version tag for the ecs_cluster_name and ecs_service_name
if [[ "${branch}" == *"release/"* ]]; then
    semantic_version=${branch#*/}
    version="${semantic_version//./-}"
    ecs_cluster_name="$ecs_cluster_name-$version"
    ecs_service_name="$ecs_service_name-$version"
fi

echo "This is ${ecs_service_name} in ${ecs_cluster_name}"

# Check the ECS clutser if exists
echo "Check this ECS clutser if exists"
ecs_listed_clusters=$(aws ecs list-clusters --region ${region} --output text)

if [[ $ecs_listed_clusters  == *"$ecs_cluster_name"* ]]; then
    echo "${ecs_cluster_name} is existing"
    
    # Fetch the task-definition
    task_definition=$(aws ecs describe-services --cluster ${ecs_cluster_name} --service ${ecs_service_name} --region "$region" --query "services[].taskDefinition" | jq -r ".[0]")
    echo "Fetched the latest task definition is ${task_definition}"


    # Rolling Update CMD
    aws ecs update-service --region "$region" \
    --cluster "$ecs_cluster_name" \
    --service "$ecs_service_name" \
    --task-definition "$task_definition" \
    --force-new-deployment  &> /dev/null
    echo "Rolling update on ${ecs_service_name}'s ${ecs_cluster_name} is done"
else
    echo "${ecs_cluster_name} is missing, skiped"
fi
