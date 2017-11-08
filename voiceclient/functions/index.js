'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js')

const welcomeIntent = (app) => {
    app.ask("Hello World!")
}

const Actions = { // the action names from the DialogFlow intent. actions mapped to functions
    "WELCOME_INTENT": "input.welcome"
}

const actionMap = new Map();
actionMap.set(Actions.WELCOME_INTENT, welcomeIntent);

const leagueVoice = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp( {request, response});
  app.handleRequest(actionMap);
});

module.exports = {
  leagueVoice
};

if (!tracking.userIsTracked) {
    console.log("hello")
}