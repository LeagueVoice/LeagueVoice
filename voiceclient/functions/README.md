# League Voice Firebase FUNCTIONS

## "Environmental" Variables To Worry About

Not "true" environmental variables: https://firebase.google.com/docs/functions/config-env

Format is `<firebase config name>` (`<env var fallback name>`)

- `oauth2.google_secret` (`CLIENT_SECRET`)
  - Encrypted ciphertext of random private key needed for oauth2 to validate that google is google.
    ([link](https://developers.google.com/actions/identity/oauth2-code-flow#client_id_and_client_secret_for_google))
  - Use `/kms/setGoogleSecret.bash` to change.
- `apiproxy.rgkey` (`RGAPI_KEY`)
  - `apiproxy`'s Riot Games API key.
- `.apiproxy.cggkey` (`CGGAPI_KEY`)
  - `apiproxy`'s Champion.GG API key.
