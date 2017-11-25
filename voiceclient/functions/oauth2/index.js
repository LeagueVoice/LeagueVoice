"use strict";

const firebase = require('firebase-admin');
const functions = require('firebase-functions');

////////// https://cloud.google.com/kms/docs/reference/libraries //////////
// Imports the Google APIs client library
const google = require('googleapis');
// Your Google Cloud Platform project ID
const projectId = 'league-voice-7fa50';
// Lists keys in the "global" location.
const location = 'global';

// Acquires credentials
google.auth.getApplicationDefault((err, authClient) => {
  if (err) {
    console.error('Failed to acquire credentials');
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
  const request = {
    parent: `projects/${projectId}/locations/${location}`
  };

  // Lists key rings
  cloudkms.projects.locations.keyRings.list(request, (err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    const keyRings = result.keyRings || [];

    if (keyRings.length) {
      console.log('Key rings:');
      result.keyRings.forEach((keyRing) => console.log(keyRing.name));
    } else {
      console.log('No key rings found.');
    }
  });
});

////////// END //////////

const express = require('express');
const app = express();
const oauth2 = functions.https.onRequest(app);

// TODO: actually handle requests

module.exports = {
  oauth2
};
