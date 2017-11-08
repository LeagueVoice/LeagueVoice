<<<<<<< HEAD
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
=======
const firebase = require('firebase');
>>>>>>> 26fe688a44df9e708349ba8ccbbeb96640e52703

// Returns true if given unique ID is already tracked by us. Returns false
// if it's a new user.
userIsTracked = function(uniqueID) {
  var database = firebase.database();
  var user = database.ref('/' + uniqueID).once('value').then(function(snapshot) {
    return snapshot;
  })
  return user !== null;
}

<<<<<<< HEAD
module.exports = userIsTracked
=======
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
	  	"region"     : region,
	  	"username"   : "default",
	  	"summonerID" : summonerName,
	  	"accountID"  : "default",
	});
}

// local functions to modify states
>>>>>>> 26fe688a44df9e708349ba8ccbbeb96640e52703
