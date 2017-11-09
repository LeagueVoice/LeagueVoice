'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js')
const firebase = require('firebase');

const welcomeIntent = (app) => {
    //Do exist:
    //Don't exist:
    app.tell("Hello World!")
}

const checkUserRankIntent = (app) => {
	tracking.createUser(10, "waddlechirp", "NA1");
/*	tracking.getUserRankByQueue(10).then(function(res){
		app.tell("You're a " + res + " player! Congratulatory statement.")
	});*/
}

const Actions = { // the action names from the DialogFlow intent. actions mapped to functions
    "WELCOME_INTENT": "input.welcome",
    "CHECK_USER_RANK": "CheckUserRank"
}

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
  firebase.initializeApp(config);
}

initialize();
const actionMap = new Map();
actionMap.set(Actions.WELCOME_INTENT, welcomeIntent);
actionMap.set(Actions.CHECK_USER_RANK, checkUserRankIntent)
createUser("test", "TeemoEater", "NA1");

const leagueVoice = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp( {request, response});
  app.handleRequest(actionMap);
});

module.exports = {
  leagueVoice
};