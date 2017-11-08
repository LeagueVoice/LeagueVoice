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
createUser = function(uniqueID) {
	admin.database().ref('/' + uniqueID).push({
	  	"champion" : null,
	  	"item" : {
	  		"0" : "temp",
	  	}
	  	"rank" : null,
	  	"region" : null,
	  	"username" : null,
	});
}