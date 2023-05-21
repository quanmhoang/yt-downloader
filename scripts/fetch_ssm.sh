#!/bin/bash
set -euo pipefail

# Unset AWS env vars from pipeline and use default profile
unset AWS_ACCESS_KEY_ID
unset AWS_SECRET_ACCESS_KEY

# Variables from pipeline
application=$CI_PROJECT_NAME
stage=$1
secret_name=$2

# Optional, use when fetching secrets from other app.
secret_full_name=${3-} 

# Fetch the secret value from AWS SSM
if [ -z "$secret_full_name" ]; then 
    # The secret_full_name is unset, fetching /$application/$stage/$secret_name

    SECRET=$(aws ssm get-parameters --name "/$application/$stage/$secret_name" --with-decryption)
    SECRET_VALUE=$(echo $SECRET | jq -r '.Parameters | .[] | .Value')
else 
    # The secret_full_name is set, fetching $secret_full_name

    SECRET=$(aws ssm get-parameters --name "$secret_full_name" --with-decryption)
    SECRET_VALUE=$(echo $SECRET | jq -r '.Parameters | .[] | .Value')
fi

# TODO: If no secrets exit 1 
# Return the value as parent use $() to invoke this script
echo $SECRET_VALUE
