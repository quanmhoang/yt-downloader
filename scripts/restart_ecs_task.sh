#!/bin/bash
set -euo pipefail

# Unset AWS env vars from pipeline and use default profile
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Variables from pipeline
cluster=$1

# Fetch ECS task name
ECS_TASK_NAMES=$(aws ecs list-tasks --cluster ${cluster} | jq -r '.taskArns | .[]')

ECS_TASK_NAMES_ARRAY=($ECS_TASK_NAMES)

for ECS_TASK_NAME in ${ECS_TASK_NAMES_ARRAY[@]}
do 
    aws ecs stop-task --cluster $cluster --task $ECS_TASK_NAME
    echo "$cluster's $ECS_TASK_NAME is stoped"
done
