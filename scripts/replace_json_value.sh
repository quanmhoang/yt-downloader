#!/bin/bash
set -euo pipefail

# Variables from pipeline
file_path=$1
var_key=$2
var_value=$3
echo "$var_value"
# Create a temp file
tmp=$(mktemp)

# Create or update the designated key with the new designated value 
jq --arg var_key "$var_key" --arg var_value "$var_value" '.[$var_key] = $var_value' "$file_path" > "$tmp" && mv "$tmp" "$file_path"