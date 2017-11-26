#!/bin/bash
set -e

# so we have access to firebase.json.
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"
cd ../voiceclient/functions/

if [ -z "$1" ]
then
  echo "No secret supplied"
  exit 1
fi

echo -e "\nSecret: \"$1\"\n";
read -p "Are you sure you want to change the secret? [yN] " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  ENC="$(echo -n "$1" | gcloud kms encrypt --location=global --keyring=firebase-oauth2 \
    --key=google-secret-key --plaintext-file=- --ciphertext-file=- | base64 -w 0)"
  echo -e "\nEncrypted: \"$ENC\"\n"
  firebase functions:config:set oauth2.google_secret="$ENC"
  echo "Done. Remember to set Cloud KMS Encrypter/Decrypter permissions for the default IAM or set up permissions manually."
fi
exit 1
