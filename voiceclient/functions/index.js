'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
var admin = require("firebase-admin");
const functions = require('firebase-functions');
const tracking = require('./backend/tracking.js');
const client = require('./backend/client.js');
const champselect = require('./backend/championSelect/championSelect.js');

const gameTimer = require('./backend/currentGame/gameTimer.js');
const firebase = require('firebase');
const fbUser = require('./firebase/user')
const aggregate = require('./backend/aggregate')
const spell = require('./backend/currentGame/spellTimer.js');
const staticIntent = require('./staticIntent');
const notesIntent = require('./notesIntent');
const matchIntent = require('./matchIntent');

const welcomeIntent = (app) => {
    //Do exist:
    //Don't exist:
    app.tell("Hello World!")
}

const checkUserRanksIntent = (app) => {
	aggregate.userRanksByQueue("test").then(function(res){
  		app.tell("You're a " + res["RANKED_SOLO_5x5"] + " player! Congratulatory statement.")
	});
}

const WinRateAgainstIntent = (app) => {
  client.getBestMatchupsByLane(client.getChampionID(app.getArgument('champion').toLowerCase()))
  .then(function(response){
    if (response[0].count != 0){
      app.tell("You should play " + client.getChampionName(response[0].matchups[0].championID) + ". They have a " + response[0].matchups[0].winrate + " winrate in this matchup.");
    }
    else {
      app.tell("I don't know. Best of luck, scrub.");
    }
  });
}


const RoleChampSuggestIntent = (app) => {
  champselect.suggestChampionToPick(app.getUser().userId, app.getArgument('role'))
  .then(function(response){
    app.tell("Based on your mastery and current winrate, champs you could play are " + response)
  });
}


const WhoToBanIntent = (app) => {
  client.getBestMatchupsByLane(client.getChampionID(app.getArgument('champion').toLowerCase()))
  .then(function(response){
    if (response[0].count != 0){
      app.tell("You should ban " + client.getChampionName(response[0].matchups[0].championID) + ". They have a " + response[0].matchups[0].winrate + " winrate in this matchup.");
    }
    else {
      app.tell("I don't know. Best of luck, scrub.");
    }
  });
}

const SummonerIntent = (app) => {
  app.ask("Your summoner name is set to: " + app.getArgument('summoner') + ". What region do you play in?")
}

const RegionIntent = (app) => {
  fbUser.createFromSummonerName(app.getUser().get_id, app.getArgument('summoner'), app.getArgument('region')).then(function(res){
    app.tell("Your region is set to: " + app.getArgument('region') + ".")
  });
}

const Actions = { // the action names from the DialogFlow intent. actions mapped to functions
    WELCOME_INTENT: 'input.welcome',
    CHECK_USER_RANKS: 'CheckUserRanks',
    STATIC_CHAMPION_ABILITY: 'Static.ChampionAbility',
    STATIC_CHAMPION_ABILITY_COOLDOWN: 'Static.ChampionAbilityCooldown',
    STATIC_CHAMPION_ATTACK_RANGE: 'Static.ChampionAttackRange',
    WIN_RATE_AGAINST: 'WinRateAgainst',
    ROLE_CHAMP_SUGGEST: "RoleChampSuggest",
    WHO_TO_BAN: 'WhoToBan',
    SUMMONER_SPELL_INTENT: 'SummonerSpellTracking',
    SUMMONER: 'Summoner',
    REGION: 'Region',
    ADVICE: 'Advice',
    WRITE_NOTE: 'WriteNote'
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
actionMap.set(Actions.CHECK_USER_RANKS, checkUserRanksIntent);
actionMap.set(Actions.STATIC_CHAMPION_ABILITY, staticIntent.championAbility);
actionMap.set(Actions.STATIC_CHAMPION_ABILITY_COOLDOWN, staticIntent.championAbilityCooldown);
actionMap.set(Actions.STATIC_CHAMPION_ATTACK_RANGE, staticIntent.championAttackRange);
actionMap.set(Actions.WIN_RATE_AGAINST, WinRateAgainstIntent);
actionMap.set(Actions.ROLE_CHAMP_SUGGEST, RoleChampSuggestIntent);
actionMap.set(Actions.WHO_TO_BAN, WhoToBanIntent);
actionMap.set(Actions.SUMMONER_SPELL_INTENT, matchIntent.SummonerSpellIntent);
actionMap.set(Actions.SUMMONER, SummonerIntent);
actionMap.set(Actions.REGION, RegionIntent);
actionMap.set(Actions.ADVICE, matchIntent.AdviceIntent);
actionMap.set(Actions.WRITE_NOTE, notesIntent.WriteNoteIntent);

// checkUserRanksIntent("test").then(function(response){
// 	console.log(JSON.stringify(response));
// }).catch(function(e){
// 	console.log(e);
// });

// champselect.suggestChampionToPick("test", "mid")
//   .then(function(response){
//      console.log(response);
//     // ("Based on your mastery and current winrate, champs you could play are " + response)
//   });

// tracking.getWinrateForChamp("test", 70)
//spell.getSpellTime('test', 'annie', 'flash').then(snap=>console.log(snap));
const leagueVoice = functions.https.onRequest((request, response) => {
  const app = new DialogflowApp( {request, response});
  app.handleRequest(actionMap);
});
//tracking.createUser(99, "Warden Parus", "NA1");
console.log(gameTimer.gameTimeAdvice(99, "NA1"));

// client.getBestMatchupsByLane(client.getChampionID("annie"))
//  .then(function(response){
//     console.log(response);
//     console.log("You should play " + client.getChampionName(response[0].matchups[0].championID) + ". They have a " + response[0].matchups[0].winrate + " winrate in this matchup.");
// });

module.exports = {
  leagueVoice
};
