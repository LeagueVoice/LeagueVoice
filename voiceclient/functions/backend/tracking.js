const firebase = require('firebase');

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
 * @returns void
*/
createUser = function(uniqueID, summonerName, region) {
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
	  	"accountID"  : "default",
	});
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

	    for (int i = 0; i < matchID.length; i++) { // << highkey probably not work?
		    for (let ID in currentMatchIDs) {
		    	if !(currentMatchIDs.includes(matchID[i].gameId)) {
					firebase.database().ref().ref.('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
						snap.numChildren().toString(): allM[i].wordcount,
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
	        if (matchResults) {
	        	won += 1
	        }
	    });
		firebase.database().ref().ref.('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
			"winrate" : (won/snapshot.numChildren())*100,
		});
	})
}
