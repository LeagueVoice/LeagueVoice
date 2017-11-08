const firebase = require('firebase');

// Returns true if given unique ID is already tracked by us. Returns false
// if it's a new user.
userIsTracked = function(uniqueID) {
  var database = firebase.database();
  var user = database.ref(uniqueID).once('value').then(function(snapshot) {
    return snapshot;
  })
  return user !== null;
}

/* Create a new user with default values 
 * @param {String} uniqueID - Google Home ID
 * @returns void
*/
createUser = function(uniqueID, summonerName, region) {
	admin.database().ref('/' + uniqueID).push({
	  	"champion"   : "default",
	  	"item"       : {
	  		"0" : "temp",
	  	},
	  	"match_history" : {
	  		"match" : {
	  			"0" : "default",
	  		},
	  		"winrate" : "default",
	  	},
	  	"region"     : "default",
	  	"username"   : "default",
	  	"summonerID" : "default",
	  	"accountID"  : "default",
	});
}

// local functions to modify states