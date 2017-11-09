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


checkSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell).once('value', snap => {
		const diff = Date.now() - snap.val()
		if (diff >= 300000) {
			return 0;
		}
		// else {
			return diff/1000;
		// }
	})

}

module.exports = {
  "storeSpellTime" : storeSpellTime,
  "storeObjectiveTime" : storeObjectiveTime,
  "checkSpellTime" : checkSpellTime
}

