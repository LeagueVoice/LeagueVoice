const firebase = require('firebase');
const client = require('./client.js');
const fbUser = require('../firebase/user')

/* Create a new user with default values
 * @param {String} uniqueID - Google Home ID
 * @param {String} summonerName - Users's summoner name
 * @param {String} region - User's Region
 * @returns void
*/
createUser = function (uniqueID, summonerName, region) {
  return client.getBySummonerName(summonerName, region).then(function (res) {
    return firebase.database().ref('users/' + uniqueID).set({
      "champion": "default",
      "item": {
        "0": "temp"
      },
      "match_history": {
        "match": {
          "0": "default" // win or loss
        },
        "winrate": "default"
      },
      "region": region,
      "summonerID": res.id,
      "accountID": res.accountId,
      "summonerName": summonerName
    });
  })
}

getUserChampionMasteries = function (uniqueID) {
  return fbUser.getById(uniqueID).then(user => {
    return client.getAllChampionMasteriesForSummoner(user['summonerID'], user['region'])
  })
}

/*
 * Returns a promise that resolves to the user's summoner level
 */
getUserLevel = function (summonerName, region) {
  return client.getBySummonerName(summonerName, region)
    .then(function (res) {
      return res['summonerLevel'];
    });
}

/*
 * Returns a promise that resolves to the date and time when the user was last active
 */
getUserLastActiveTime = function (summonerName, region) {
  return client.getBySummonerName(summonerName, region)
    .then(function (res) {
      return new Date(res['revisionDate']).toString();
    });
}

// Returns a promise that resoves to a map from queue type to string rank
// within that league. The input user uniqueID is assumed to correspond to a
// user that has already been created.
getUserRanksByQueue = function (uniqueID, my_firebase) { // TODO: remove my_firebase
  return fbUser.getById(uniqueID).then(function (snapshot) {
      console.log(snapshot);
      return client.getAllLeaguePositionsForSummoner(snapshot.summonerID, snapshot.region);
    }).then(function (positions) {
      let byQueue = {};
      positions.forEach(function (pos) {
        byQueue[pos["queueType"]] = pos["tier"] + " " + pos["rank"];
      });
      return byQueue;
    });
}

/* Add new matches to user match history
 * @param {String} uniqueID
 * @param {JSON} matchID
 * @returns void
 */
updateMatchHistory = function (uniqueID, matchID) {

  let finishedRunning = false;
  let ref = firebase.database().ref("users/" + uniqueID).child('/match_history/match')
  let currentMatchIDs = []
  ref.once('value', function (snap) {

    snap.forEach(function (item) {
      let matchResults = item.val();
      currentMatchIDs.push(matchResults);
    });

    for (var i = 0; i < matchID.length; i++) { // << highkey probably not work?
      for (let ID in currentMatchIDs) {
        if (!(currentMatchIDs.includes(matchID[i].gameId))) {
          firebase.database().ref('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
            [snap.numChildren().toString()]: allM[i].wordcount
          });
        }
      }
    }
  });
}

/* Calculate winrate in current match games logged
 * @returns void
 */
calculateWinrate = function (uniqueID) {
  let won = 0
  let total = 0
  let ref = firebase.database().ref().child('users/' + uniqueID + '/match_history/')
  ref.child("match").once('value', function (snap) {
    snap.forEach(function (item) {
      let matchResults = item.val();
      total += 1
      if (matchResults["status"] === 'Win') {
        won += 1
      }
      ref.update({
        "winrate": won / total
      })
    })
  })
}

addNewMatches = function (uniqueID, summonerID, region) {

  client.getRecentMatchList(summonerID, region).then(function (res) {
    console.log(res)
    matchHistory = res

    let championId = []
    let gameId = []
    // console.log(matchHistory["matches"])
    for (let key of matchHistory["matches"]) {
      // console.log(key["champion"])
      // console.log("-------------------------------------")
      championId.push(key["champion"]) // list of champions for each game
      gameId.push(key["gameId"])
    }
    // console.log(matchHistory)
    // console.log("reeeeee")

    let asdf = []
    for (let game of gameId) { // every game: gameId[index]
      const index = gameId.indexOf(game) // index for game data
      loop2: client.getMatch(game, region).then(function (res) {


        loop: for (let key of res["participants"]) {
          if (key["championId"] == championId[index]) {
            console.log("TEAM: " + key["teamId"])
            console.log("halsdfkldsjakljl")
            if (key["teamId"] == 100) {
              asdf.push(res["teams"][0]["win"])
              console.log("asjdkfljsdklafjklds")
            }
            else {
              asdf.push(res["teams"][1]["win"])
              console.log("asdfsdfasdfasf")
            }
            let ref = firebase.database().ref().child('/users/match_history/match')
            ref.once('value', function (snap) {
              var count = 0
              firebase.database().ref('/users/' + uniqueID + '/match_history/match/' + gameId[index]).set({
                "champion": championId[index],
                "status": asdf[index]
              });
            })
            break loop;
          }
        }
      })
    }
  })
}

calculateIndividualChampWinrate = function (uniqueID) {
  let championsPlayed = []
  let ref = firebase.database().ref().child('/users/' + uniqueID + '/match_history/')
  ref.child('champ_winrate').set({
    "0": "default"
  })
  ref.child("match").once('value', function (snap) {
    snap.forEach(function (item) {
      let matchResults = item.val();
      console.log("sadjkflsjaklf")
      console.log(typeof(matchResults["champion"]))

      // // console.log(championsPlayed.indexOf(matchResults["champion"]))
      if (typeof matchResults !== 'undefined') {
        // 	console.log("accessed")
        ref.child('champ_winrate/' + matchResults["champion"]).once('value', function (snap) {

          if (snap.val() === null) {
            // console.log("samerip")
            if (matchResults["status"] === 'Win') {
              ref.child('champ_winrate/' + matchResults["champion"]).set({
                "win": 1,
                "total": 1
              })
            }
            else {
              ref.child('champ_winrate/' + matchResults["champion"]).set({
                "win": 0,
                "total": 1
              })
            }
          }
          else {
            console.log("ASDFADFSDAFADSF")
            if (matchResults["status"] === 'Win') {
              ref.child('champ_winrate/' + matchResults["champion"]).set({
                "win": snap.val()["total"] + 1,
                "total": snap.val()["total"] + 1
              })
            }
            else {
              ref.child('champ_winrate/' + matchResults["champion"]).set({
                "win": snap.val()["total"],
                "total": snap.val()["total"] + 1
              })
            }
          }
        })
      }
    });
  })
}

module.exports = {
  "createUser": createUser,
  "getUserRanksByQueue": getUserRanksByQueue,
  "getUserChampionMasteries": getUserChampionMasteries
}