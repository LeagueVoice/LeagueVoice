const firebase = require('firebase');
const client = require('./client.js');

const getUser = function (uniqueID, my_firebase) {
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
userIsTracked = function(uniqueID) {
  getUser(uniqueID).then(function(snapshot) {
    return snapshot !== null;
  })
}

/* Create a new user with default values
 * @param {String} uniqueID - Google Home ID
 * @param {String} summonerName - Users's summoner name
 * @param {String} region - User's Region
 * @returns void
*/
createUser = function(uniqueID, summonerName, region) {
	return client.getBySummonerName(summonerName, region).then(function(res) {
		return firebase.database().ref('users/' + uniqueID).set({
			"champion"   : "default",
			"item"       : {
				"0" : "temp",
			},
			"match_history" : {
				"match" : {
					"0" : "default", // win or loss
				},
				"winrate" : "default",
			},
			"region"     : region,
			"summonerID" : res.id,
			"accountID"  : res.accountId,
      "summonerName": summonerName
		});
	})
}

getUserChampionMasteries = function (uniqueID) {
	return getUser(uniqueID).then(snapshot => {
    console.log(snapshot )
			client.getAllChampionMasteriesForSummoner(snapshot['summonerID'],snapshot['region'])
		})
}

// Returns a promise that resoves to a map from queue type to string rank
// within that league. The input user uniqueID is assumed to correspond to a
// user that has already been created.
getUserRanksByQueue = function(uniqueID, my_firebase) {
  return my_firebase.database()
      .ref('users/' + uniqueID)
      .once('value')
      .then(function(snapshot) {
  		return getUser(uniqueID, my_firebase)
  	}).then(function(snapshot) {
  		console.log(snapshot);
    	return client.getAllLeaguePositionsForSummoner(snapshot.summonerID, snapshot.region);
  	}).then(function(positions) {
    	let byQueue = {};
    	positions.forEach(function(pos) {
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
updateMatchHistory = function(uniqueID, matchID) {

	let finishedRunning = false;
	let ref = firebase.database().ref("users/" + uniqueID).child('/match_history/match')
	let currentMatchIDs = []
	ref.once('value', function(snap) {

	    snap.forEach(function(item) {
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
calculateWinrate = function() {
	let ref = firebase.database().ref().child('/match_history/match')
	let won = 0
	ref.once('value', function(snap) {
		snap.forEach(function(item) {
	        let matchResults = item.val();
	        if (matchResults != "default") {
	        	won += 1
	        }
	    });
		firebase.database().ref('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
			"winrate" : (won/snapshot.numChildren())*100,
		});
	})
}


addNewMatches = function(uniqueID, summonerID, region) {

	client.getRecentMatchList(summonerID, region).then(function(res) {
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
			loop2: client.getMatch(game, region).then(function(res) {


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
						ref.once('value', function(snap) {
							var count = 0
							firebase.database().ref('/users/' + uniqueID + '/match_history/match/' + gameId[index]).set({
								"champion" : championId[index],
								"status" : asdf[index]
							});
						})
						break loop;
					}
				}
			})
		}
	})
}

calculateIndividualChampWinrate = function(uniqueID) {
	let ref = firebase.database().ref().child('/match_history/match')
	let won = 0
	ref.once('value', function(snap) {
		for (let i = 0; i < snap.numChildren(); i++) {
			snap.forEach(function(item) {
	        	let matchResults = item.val();
	        	console.log(matchResults[i]["champion"])
	   		});
		}
		// firebase.database().ref('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
		// 	"winrate" : (won/snapshot.numChildren())*100,
		// });
	})
}

module.exports = {
  "userIsTracked": userIsTracked,
	"getUser": getUser,
  "createUser": createUser,
  "getUserRanksByQueue": getUserRanksByQueue,
  "getUserChampionMasteries": getUserChampionMasteries
}

