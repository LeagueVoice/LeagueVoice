const firebase = require('firebase');

function initialize() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB9sQFV5h8cK3kDGkMtKy4-6RK3x7Aados",
    authDomain: "league-voice-7fa50.firebaseapp.com",
    databaseURL: "https://league-voice-7fa50.firebaseio.com",
    projectId: "league-voice-7fa50",
    storageBucket: "league-voice-7fa50.appspot.com",
    messagingSenderId: "702299684043"
  };
  return firebase.initializeApp(config);
}

/** initializes and returns the app */
module.exports = initialize()