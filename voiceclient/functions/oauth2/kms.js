// Your Google Cloud Platform project ID
const projectId = 'league-voice-7fa50';
// The location of the crypto key's key ring, e.g. "global"
const locationId = 'global';
// The name of the crypto key's key ring, e.g. "my-key-ring"
const keyRingId = 'firebase-oauth2';

// Encoding used for buffers.
const encoding = 'ascii';

// cloudkms promise.
const cloudkms = new Promise((resolve, reject) => {
  // Imports the Google APIs client library
  const google = require('googleapis');

  // Acquires credentials
  google.auth.getApplicationDefault((err, authClient) => {
    if (err) {
      reject(err);
      return;
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/cloud-platform'
      ]);
    }

    // Instantiates an authorized client
    const cloudkms = google.cloudkms({
      version: 'v1',
      auth: authClient
    });

    resolve(cloudkms);
  });
});

// Log any errors.
cloudkms.catch(console.error);

function encrypt(plaintext, cryptoKeyId) {
  // Get Cloud KMS client
  return cloudkms.then(cloudkms => {
    const request = {
      // This will be a path parameter in the request URL
      name: `projects/${projectId}/locations/${locationId}/keyRings/${keyRingId}/cryptoKeys/${cryptoKeyId}`,
      // This will be the request body
      resource: {
        plaintext: Buffer(plaintext, encoding).toString('base64')
      }
    };

    // Encrypts the file using the specified crypto key
    return new Promise((resolve, reject) => cloudkms.projects.locations.keyRings.cryptoKeys
      .encrypt(request, (err, result) => err ? reject(err) : resolve(result)))
      .then(result => result.ciphertext);
  });
}

function decrypt(ciphertext64, cryptoKeyId) {
  if (!/^[A-Za-z0-9+/]+=*$/.test(ciphertext64) || (ciphertext64.length % 4))
    throw new Error(`Invalid ciphertext64: "${ciphertext64}".`);
  // Get Cloud KMS client
  return cloudkms.then(cloudkms => {
    const request = {
      // This will be a path parameter in the request URL
      name: `projects/${projectId}/locations/${locationId}/keyRings/${keyRingId}/cryptoKeys/${cryptoKeyId}`,
      // This will be the request body
      resource: {
        ciphertext: ciphertext64
      }
    };

    // Dencrypts the file using the specified crypto key
    return new Promise((resolve, reject) => cloudkms.projects.locations.keyRings.cryptoKeys
      .decrypt(request, (err, result) => err ? reject(err) : resolve(result)))
      .then(result => Buffer.from(result.plaintext, 'base64').toString(encoding));
  });
}

module.exports = {
  encrypt,
  decrypt
};
