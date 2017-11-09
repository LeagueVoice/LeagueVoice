'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js')
const firebase = require('firebase');

const staticIntent = require('./staticIntent');

const welcomeIntent = (app) => {
    //Do exist:
    //Don't exist:
    app.tell("Hello World!")
}

const checkUserRanksIntent = (app) => {
	tracking.getUserRanksByQueue("test", firebase).then(function(res){
		app.tell("You're a " + res["RANKED_SOLO_5x5"] + " player! Congratulatory statement.")
	});
}

const Actions = { // the action names from the DialogFlow intent. actions mapped to functions
    WELCOME_INTENT: 'input.welcome',
    CHECK_USER_RANK: 'CheckUserRank',
    STATIC_CHAMPION_ABILITY: 'Static.ChampionAbility'
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
actionMap.set(Actions.CHECK_USER_RANK, checkUserRanksIntent);
actionMap.set(Actions.STATIC_CHAMPION_ABILITY, staticIntent.championAbility);

// getUserRanksByQueue("test", firebase).then(function(response){
// 	console.log(JSON.stringify(response));
// }).catch(function(e){
// 	console.log(e);
// });

const leagueVoice = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp( {request, response});
  app.handleRequest(actionMap);
});

calculateWinrate("test")

module.exports = {
  leagueVoice
};
