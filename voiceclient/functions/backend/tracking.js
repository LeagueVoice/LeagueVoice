"use strict";

const firebase = require('firebase');
const client = require('./client.js');

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
function userIsTracked(uniqueID) {
  return getUser(uniqueID).then(snapshot => snapshot !== null);
}

/* Create a new user with default values
 * @param {String} uniqueID - Google Home ID
 * @param {String} summonerName - Users's summoner name
 * @param {String} region - User's Region
 * @returns void
*/
function createUser(uniqueID, summonerName, region) {
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

function getUserChampionMasteries(uniqueID) {
	return getUser(uniqueID).then(user =>
		client.getAllChampionMasteriesForSummoner(user['summonerID'],user['region']));
}

/*
 * Returns a promise that resolves to the user's summoner level
 */
function getUserLevel(summonerName, region) {
	return client.getBySummonerName(summonerName, region)
		.then(res => res['summonerLevel']);
}

/*
 * Returns a promise that resolves to the date and time when the user was last active
 */
function getUserLastActiveTime(summonerName, region) {
	return client.getBySummonerName(summonerName, region)
		.then(res => new Date(res['revisionDate']).toString());
}

// Returns a promise that resoves to a map from queue type to string rank
// within that league. The input user uniqueID is assumed to correspond to a
// user that has already been created.
function getUserRanksByQueue(uniqueID, my_firebase) {
  return my_firebase.database()
	  .ref('users/' + uniqueID)
	  .once('value')
	  .then(snapshot => getUser(uniqueID, my_firebase))
		.then(snapshot => {
			console.log(snapshot);
			return client.getAllLeaguePositionsForSummoner(snapshot.summonerID, snapshot.region);
		})
		.then(positions => {
			let byQueue = {};
			positions.forEach(pos =>
				byQueue[pos["queueType"]] = pos["tier"] + " " + pos["rank"]);
			return byQueue;
	  });
}

/* Add new matches to user match history
 * @param {String} uniqueID
 * @param {JSON} matchID
 * @returns void
 */
function updateMatchHistory(uniqueID, matchID) {
	let finishedRunning = false;
	let ref = firebase.database().ref("users/" + uniqueID).child('/match_history/match')
	let currentMatchIDs = []
	ref.once('value', snap => {

		snap.forEach(item => {
			let matchResults = item.val();
			currentMatchIDs.push(matchResults);
		});

		for (var i = 0; i < matchID.length; i++) { // << highkey probably not work?
			for (let ID in currentMatchIDs) {
				if (!(currentMatchIDs.includes(matchID[i].gameId))) {
					firebase.database()
						.ref('/' + uniqueID + '/match_history/' + snap.numChildren())
						.update({
							[snap.numChildren().toString()]: allM[i].wordcount
					  });
		  	}
			}
		}
	});
}

/* Calculate winrate in current match games logged
 * @param {String} uniqueID
 * @returns void
 */
function calculateWinrate(uniqueID) {
	let won = 0
	let total = 0
	let ref = firebase.database().ref().child('users/' + uniqueID + '/match_history/')
	ref.child("match").once('value', function(snap) {
		snap.forEach(function(item) {
        	let matchResults = item.val();
        	total += 1
        	if (matchResults["status"] === 'Win') {
        		won += 1
        	}
        	ref.update({
        		"winrate" : won/total
			})
   		})
	})
}

/* Get winrate for specific champion
 * @param {String} uniqueID
 * @param {Int} championID
 */
function getWinrateForChamp(uniqueID, championID) {
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
function addNewMatches(uniqueID, summonerID, region) {

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
	});
}

/* Update winrates from match history for each champion
 * @param {String} uniqueID
 * @returns void
 */
function calculateIndividualChampWinrate(uniqueID) {
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

    	// // console.log(championsPlayed.indexOf(matchResults["champion"]))
    	if (!matchResults)
				return;
    	// 	console.log("accessed")
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
  userIsTracked,
	getUser,
  createUser,
  getUserRanksByQueue,
  getUserChampionMasteries,
	getWinrateForChamp,
}
