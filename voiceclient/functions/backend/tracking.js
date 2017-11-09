const firebase = require('firebase');
const client = require('./client.js');

// Returns true if given unique ID is already tracked by us. Returns false
// if it's a new user.
userIsTracked = function(uniqueID) {
  var database = firebase.database();
  var user = database.ref('/' + uniqueID).once('value').then(function(snapshot) {
    return snapshot;
  })
  return user !== null;
}


/* Create a new user with default values 
 * @param {String} uniqueID - Google Home ID
 * @param {String} summonerName - Users's summoner name
 * @param {String} region - User's Region
 * @returns void
*/
createUser = function(uniqueID, summonerName, region) {
	client.getBySummonerName(summonerName, region).then(function(res) {
		firebase.database().ref('/' + uniqueID).push({
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
			"summonerID" : summonerName,
			"accountID"  : res.accountId,
		});
	})
}

/* Add new matches to user match history
 * @param {String} uniqueID
 * @param {JSON} matchID
 * @returns void
 */
updateMatchHistory = function(uniqueID, matchID) {

	let finishedRunning = false;
	let ref = firebase.database().ref().child('/match_history/match')
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

calculateIndividualChampWinrate = function(uniqueID, summonerID, region) {

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
						if (key["teamId"] == 100) {
							asdf.push(res["teams"][0]["win"])
						  // teams: 
						}
						else {
							asdf.push(res["teams"][1]["win"])
						}
						console.log(championId)
						console.log(asdf)

						firebase.database().ref('/' + uniqueID + '/match_history/match/' + snap.numChildren()).update({
							[snap.numChildren().toString()] : "asdf"
						});
						break loop;
					}
				}
			})
		}
	})
}

calculateIndividualChampWinrate("test", 237254272, "na1")
