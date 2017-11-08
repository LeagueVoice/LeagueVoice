'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js')

const welcomeIntent = () => {

}

const Actions = { // the action names from the API.AI intent. actions mapped to functions

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