const firebase = require('firebase');

// Time Flash

storeSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion)
		.push({
			spell: Date.now();
		})
	console.log("Done");
}

storeObjectiveTime = function(uniqueID, objective) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/objectives/')
		.push({
			objective: Date.now();
		})
}

storeSpellTime('test', 'annie', 'flash');