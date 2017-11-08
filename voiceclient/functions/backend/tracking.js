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

/* Modify current match history
 * @returns void
 */
 updateMatchHistory = function(uniqueID, gameID) {
 	// check if match id exists
	let ref = admin.database().ref().child('/match_history/match')
	let currentMatchIDs = []
	let addMatches = []
	ref.once('value', function(snap) {

	    snap.forEach(function(item) {
	        let matchResults = item.val();
	       	currentMatchIDs.push(matchResults);
	    });

	    for (let ID in gameID) {
	    	if (gameID.includes(ID)) {
	    		addMatches.push(allM[i].wordcount);
	    	}
	    }

	});

 	// admin.database().ref().ref.('/' + uniqueID + '/match_history').update({
 	// 	"profileThumbnail": url,
 	// });
 }

// updateMatchHistory("asdfasdfasdf", )
createUser("asdfasdfasdf", "asdf", "asdf")
