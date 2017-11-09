'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js')

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

const actionMap = new Map();
actionMap.set(Actions.WELCOME_INTENT, welcomeIntent);
actionMap.set(Actions.CHECK_USER_RANK, checkUserRankIntent)

const leagueVoice = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp( {request, response});
  app.handleRequest(actionMap);
});

module.exports = {
  leagueVoice
};