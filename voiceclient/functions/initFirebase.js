'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
try {
  // Production
  admin.initializeApp(functions.config().firebase);
}
catch(e) {
  // Local
  let serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://league-voice-7fa50.firebaseio.com"
  });
}
