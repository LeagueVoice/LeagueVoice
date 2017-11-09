const firebase = require('firebase');

/* Store the time when spell expires in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
storeSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
		.set(Date.now())
}

/* Store the time when objective comes up again in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {String} objective - objective name to store time for
 */
storeObjectiveTime = function(uniqueID, objective) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/objectives/' + objective)
		.set(Date.now())
}

/* Check if time for spell is up again
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
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
  "storeSpellTime"     : storeSpellTime,
  "storeObjectiveTime" : storeObjectiveTime,
  "checkSpellTime"     : checkSpellTime
}

