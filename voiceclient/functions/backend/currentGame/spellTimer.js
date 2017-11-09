const firebase = require('firebase');


// Time Flash
storeSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
		.set(Date.now())
}

storeObjectiveTime = function(uniqueID, objective) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/objectives/' + objective)
		.set(Date.now())
}

module.exports = {
  "storeSpellTime" : storeSpellTime,
  "storeObjectiveTime" : storeObjectiveTime
}

