'use strict';

const DialogflowApp = require('actions-on-google').DialogflowApp;
const Contextizer = require('contextizer');
const rp = require('request-promise-native');

// const admin = require("firebase-admin");
// const firebase = require('firebase-admin');

const functions = require('firebase-functions');
// const tracking = require('./backend/tracking.js');
const client = require('./backend/client');

const champselect = require('./backend/championSelect/championSelect.js');
// const gameTimer = require('./backend/currentGame/gameTimer');
const fbUser = require('./firebase/user');
// const aggregate = require('./backend/aggregate');
// const spell = require('./backend/currentGame/spellTimer');
// const tipBackend = require('./backend/userNotes/enemyTips');

const notesIntent = require('./notesIntent');
const matchIntent = require('./matchIntent');
const itemIntent = require('./itemIntent');
// const championRole = require('./backend/itemization/championRole');
const tipsIntent = require('./tipsIntent');

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// const welcomeIntent = (app) => {
//     app.ask("Welcome to League Voice! How can I help you improve?");
// };

const WhoToPlayAgainstIntent = (app) => {
  //console.log(client.getChampionID(app.getArgument('champion').toLowerCase()));
  client.getBestMatchupsByLane(client.getChampionID(app.getArgument('champion').toLowerCase()))
    .then(response => {
      //console.log(response);
      if (response[0].count != 0) {
        var name = capitalize(client.getChampionName(response[0].matchups[0].championID));
        app.ask(`You should play ${name}. ${name} has a ${Math.round(response[0].matchups[0].winrate * 100)} percent winrate in this matchup.`);
      }
      else {
        app.tell("Welp, I have no clue. Play what feels best!");
      }
    });
};

const RoleChampSuggestIntent = (app) => {
  champselect.suggestChampionToPick(app.getUser()["userId"], app.getArgument('role').toUpperCase())
    .then(response => {
      //console.log(response)
      let champStrings = [];
      let name, niceName;
      let i = 0;
      for (; i < response.length; i++) {
        name = capitalize(client.getChampionName(response[i]));
        champStrings.push(name);
      }
      champStrings[champStrings.length - 1] = 'or ' + name;
      app.ask(`Based on your mastery and current winrate, some champs you could play are ${champStrings.join(', ')}.`);
    })
    .catch(e => app.tell("I can't suggest champions for you right now. Make sure that you've registered your summoner with me."));
};

const WhoToBanIntent = (app) => {
  client.getBestMatchupsByLane(client.getChampionID(app.getArgument('champion').toLowerCase()))
    .then(response => {
      if (response[0].count != 0){
        var name = capitalize(client.getChampionName(response[0].matchups[0].championID));
        app.ask(`How about banning ${name}? ${name} has a ${Math.round(response[0].matchups[0].winrate * 100)} percent winrate in this matchup.`);
      }
      else {
        app.tell("Welp, I have no clue. Play what feels best!");
      }
    });
};

const SummonerIntent = (app) => {
  app.ask("Your summoner name is set to: " + app.getArgument('summoner') + ". What region do you play in?");
};

const RegionIntent = (app) => {
  fbUser.createFromSummonerName(app.getUser()['userId'], app.getArgument('summoner'), app.getArgument('region'))
    .then(ignoredResponse => app.ask(`Your region is set to: ${app.getArgument('region')}.`));
};

const Actions = { // the action names from the DialogFlow intent. actions mapped to functions
    // WELCOME_INTENT: 'input.welcome',
    // CHECK_USER_RANKS: 'CheckUserRanks', // moved to lookupIntents
    // STATIC_CHAMPION_ABILITY: 'Static.ChampionAbility',
    // STATIC_CHAMPION_ABILITY_COOLDOWN: 'Static.ChampionAbilityCooldown',
    // STATIC_CHAMPION_ATTACK_RANGE: 'Static.ChampionAttackRange',
    // STATIC_CHAMPION_COUNT: 'Static.ChampionCount',
    // STATIC_CHAMPION_ABILITY_COST: 'Static.ChampionAbilityCost',
    // STATIC_CHAMPION_ABILITY_DAMAGE: 'Static.ChampionAbilityDamage',
    WHO_TO_PLAY_AGAINST: 'WhoToPlayAgainst',
    ROLE_CHAMP_SUGGEST: "RoleChampSuggest",
    WHO_TO_BAN: 'WhoToBan',
    SS_STORE_INTENT: 'SummonerSpellStore',
    SS_GET_INTENT: 'SummonerSpellGet',
    ENEMY_INFO: 'EnemyInfo',
    SUMMONER: 'Summoner',
    REGION: 'Region',
    ADVICE: 'Advice',
    WRITE_NOTE: 'WriteNote',
    READ_NOTE: 'ReadNote',
    ITEM_SUGGESTION: 'ItemWinLoseEqual',
    ENEMY_TIPS: 'EnemyTips'
};

const actionMap = new Map();
// actionMap.set(Actions.WELCOME_INTENT, welcomeIntent);
// actionMap.set(Actions.CHECK_USER_RANKS, checkUserRanksIntent);
actionMap.set(Actions.WHO_TO_PLAY_AGAINST, WhoToPlayAgainstIntent);
actionMap.set(Actions.ROLE_CHAMP_SUGGEST, RoleChampSuggestIntent);
actionMap.set(Actions.WHO_TO_BAN, WhoToBanIntent);
actionMap.set(Actions.SS_STORE_INTENT, matchIntent.SummonerSpellStoreIntent);
actionMap.set(Actions.SS_GET_INTENT, matchIntent.SummonerSpellGetIntent);
actionMap.set(Actions.ENEMY_INFO, matchIntent.EnemyInfoIntent);
actionMap.set(Actions.SUMMONER, SummonerIntent);
actionMap.set(Actions.REGION, RegionIntent);
actionMap.set(Actions.ADVICE, matchIntent.AdviceIntent);
actionMap.set(Actions.WRITE_NOTE, notesIntent.WriteNoteIntent);
actionMap.set(Actions.READ_NOTE, notesIntent.ReadNoteIntent);
actionMap.set(Actions.ITEM_SUGGESTION, itemIntent.ItemSuggestion);
actionMap.set(Actions.ENEMY_TIPS, tipsIntent.EnemyTipsIntent);



// actionMap.set(Actions.STATIC_CHAMPION_ABILITY, staticIntent.championAbility);
// actionMap.set(Actions.STATIC_CHAMPION_ABILITY_COOLDOWN, staticIntent.championAbilityCooldown);
// actionMap.set(Actions.STATIC_CHAMPION_ATTACK_RANGE, staticIntent.championAttackRange);
// actionMap.set(Actions.STATIC_CHAMPION_COUNT, staticIntent.championCount);
// actionMap.set(Actions.STATIC_CHAMPION_ABILITY_COST, staticIntent.championAbilityCost);
// actionMap.set(Actions.STATIC_CHAMPION_ABILITY_DAMAGE, staticIntent.championAbilityDamage);

//// NEW WAY OF DOING THINGS ////
let context = new Contextizer();
context.register('request').asInput();
context.register('assistant').asInput();
context.register('get').asConstant(url => rp(url).catch(e => rp(url)));
context.register('locale').asFunction({
  deps: [ 'assistant' ],
  func: ({ assistant }) => assistant.getUserLocale() || 'en'
});
context.register('sign.in').asFunction({
  deps: [ 'assistant' ],
  func({ assistant }) {
    if (assistant.getSignInStatus() === assistant.SignInstatus.OK) {
      // let accessToken = assistant.getUser().accessToken;
      // TODO? Check firebase user?
      assistant.ask('Great, thanks for signing in! How can I help?');
    } else { // TODO
      assistant.ask('I won\'t be able to save your data, but let\'s continue!');
    }
  }
})
//// REGISTER CONTEXTS ////
require('./contexts/firebaseContext')(context);
//// REGISTER INTENTS ////
require('./staticIntents/staticIntent')(context);
require('./lookupIntents/lookupIntents')(context);


// DEBUG FUNCTIONS
let debug = true;
if (debug) {
  require('./debugIntents/debugIntent')(context);
}



const leagueVoice = functions.https.onRequest((request, response) => {
  const assistant = new DialogflowApp({ request, response });
  let target = assistant.getIntent();
  target = target.charAt(0).toLowerCase() + target.slice(1);
  if (context.hasTarget(target)) {
    context.execute(target, { assistant, request })
      .catch(e => {
        if (!e)
          return;
        console.error(e);
        assistant.ask('Sorry, an error occurred.');
      });
  }
  else {
    assistant.handleRequest(actionMap);
  }
});

module.exports = {
  leagueVoice
};
