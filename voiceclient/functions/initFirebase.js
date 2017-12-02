'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
try {
  // Local and Production
  let serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://league-voice-7fa50.firebaseio.com",
    // optional:
    apiKey: "AIzaSyB9sQFV5h8cK3kDGkMtKy4-6RK3x7Aados",
    authDomain: "league-voice-7fa50.firebaseapp.com",
    projectId: "league-voice-7fa50",
    storageBucket: "league-voice-7fa50.appspot.com",
    messagingSenderId: "702299684043"
  });
}
catch(e) {
  console.error('Please set up your serviceAccountKey.json');
  // IDK lol if they happen to not have a serviceAccountKey.
  admin.initializeApp(functions.config().firebase);
}
