"use strict";

const firebase = require('firebase');
const client = require('./client.js');
const fbUser = require('../firebase/user')

const getUser = function(uniqueID, my_firebase) {
	return new Promise((resolve, reject)=>{
   	  my_firebase.database()
	  .ref('users')
	  .once('value', function(snapshot){
		resolve(snapshot.val()[uniqueID])
	  }, reject)
	})
}

// Returns true if given unique ID is already tracked by us. Returns false
// if it's a new user.
const userIsTracked = function(uniqueID) {
  return getUser(uniqueID).then(snapshot => snapshot !== null);
}

/* Create a new user with default values
 * @param {String} uniqueID - Google Home ID
 * @param {String} summonerName - Users's summoner name
 * @param {String} region - User's Region
 * @returns void
*/
const createUser = function(uniqueID, summonerName, region) {
	return client.getBySummonerName(summonerName, region).then(function(res) {
		return firebase.database().ref('users/' + uniqueID).set({
			"accountID"  : res.accountId,
			"champion"   : "default",
			"currentMatch"       : {
				"objectives" : {
					"0" : "default",
				},
				"players" : {
					"0" : "default",
				},
			},
			"match_history" : {
				"champ_winrate" : {
					"0" : "default",
				},
				"match" : {
					"0" : "default", // win or loss
				},
				"winrate" : "default",
			},
			"region"     : region,
			"summonerID" : res.id,
	  		"summonerName": summonerName,
  			"userNotes" : {
				"champion" : {
					"0" : "default",
				},
			},
		});
	})
}

const getUserChampionMasteries = function(uniqueID) {
	return getUser(uniqueID).then(user =>
		client.getAllChampionMasteriesForSummoner(user['summonerID'],user['region']));
}

/*
 * Returns a promise that resolves to the user's summoner level
 */
const getUserLevel = function(summonerName, region) {
	return client.getBySummonerName(summonerName, region)
		.then(res => res['summonerLevel']);
}

/*
 * Returns a promise that resolves to the date and time when the user was last active
 */

const getUserLastActiveTime = function(summonerName, region) {
	return client.getBySummonerName(summonerName, region)
		.then(res => new Date(res['revisionDate']).toString());
}

/* Get winrate for specific champion
 * @param {String} uniqueID
 * @param {Int} championID
 */
const getWinrateForChamp = function(uniqueID, championID) {
	let ref = firebase.database().ref().child('users/' + uniqueID + '/match_history/champ_winrate/' + championID)
	ref.once('value', function(snap) {
		console.log((snap.val()["win"]/snap.val()["total"]) * 100)
		return ((snap.val()["win"]/snap.val()["total"]) * 100)
	})
}

/* Add new games from recent 20 matches
 * @param {String} uniqueID
 * @param {String} summonerID
 * @param {String} region
 * @returns void
 */
const addNewMatches = function(uniqueID, summonerID, region) {

	client.getRecentMatchList(summonerID, region).then(res => {
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
			lient.getMatch(game, region)
				.then(res => {
					for (let key of res["participants"]) {
						if (key["championId"] !== championId[index])
							continue;
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
						ref.once('value', snap => {
							var count = 0
							firebase.database().ref('/users/' + uniqueID + '/match_history/match/' + gameId[index]).set({
								"champion" : championId[index],
								"status" : asdf[index]
							});
						});
						break;
					}
				});
		}
	})
}

/* Calculate winrate in current match games logged
 * @param {String} uniqueID
 * @returns void
 */
const calculateWinrate = function(uniqueID) {
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

/* Add new matches to user match tracking records
 * @param {String} uniqueID
 * @param {String} summonerID
 * @param {String} region
 * @returns void
 */
const addNewMatches = function(uniqueID, summonerID, region) {

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

/* Update winrates from match history for each champion
 * @param {String} uniqueID
 * @returns void
 */
const calculateIndividualChampWinrate = function(uniqueID) {
	let championsPlayed = []
	let ref = firebase.database().ref().child('/users/' + uniqueID + '/match_history/')
	ref.child('champ_winrate').set({
		"0" : "default"
	});
	ref.child("match").once('value', snap => {
		snap.forEach(item => {
    	let matchResults = item.val();
    	console.log("sadjkflsjaklf");
    	console.log(typeof(matchResults["champion"]));

    	if (!matchResults)
				return;
    	ref.child('champ_winrate/' + matchResults["champion"])
				.once('value', snap => {
	    		if (!snap.val()) {
	    			// console.log("samerip")
	    			if (matchResults["status"] === 'Win') {
	      			ref.child('champ_winrate/' + matchResults["champion"]).set({
	      				"win" : 1,
	      				"total" : 1
	      			});
	    			}
	    			else {
	      			ref.child('champ_winrate/' + matchResults["champion"]).set({
	      				"win" : 0,
	      				"total" : 1
	      			});
	    			}
	    		}
	    		else {
	    			console.log("ASDFADFSDAFADSF")
	    			if (matchResults["status"] === 'Win') {
	      			ref.child('champ_winrate/' + matchResults["champion"]).set({
	      				"win" : snap.val()["total"] + 1,
	      				"total" : snap.val()["total"] + 1,
	      			});
	    			}
	    			else {
	      			ref.child('champ_winrate/' + matchResults["champion"]).set({
	      				"win" : snap.val()["total"],
	      				"total" : snap.val()["total"] + 1,
	      			});
	    			}
	    		}
	    	});
 		});
	});
}

module.exports = {
	getWinrateForChamp
}