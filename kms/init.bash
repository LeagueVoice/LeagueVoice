#!/bin/bash
set -e

LOCATION=global
KEYRING=firebase-oauth2
gcloud kms keyrings create $KEYRING --location $LOCATION \
  || echo "Failed to create keyring."

for NAME in auth-code-key refresh-token-key google-secret-key
do
  gcloud kms keys create $NAME --location $LOCATION \
    --keyring $KEYRING \
    --purpose encryption \
    --rotation-period 90d \
    --next-rotation-time "$(date -d "+15 days")" \
    || echo "Failed to create key."
done
