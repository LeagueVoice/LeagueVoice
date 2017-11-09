const firebase = require('firebase');

/* Store the time when spell expires in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const storeSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
		.set(Date.now())
}

/* Store the time when objective comes up again in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {String} objective - objective name to store time for
 */
const storeObjectiveTime = function(uniqueID, objective) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/objectives/' + objective)
		.set(Date.now())
}

/* Check if time for spell is up again (ref: getSpellTime)
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const checkSpellTime = function(uniqueID, champion, spell) {
<<<<<<< HEAD
	return new Promise((resolve, reject)=>{
		firebase.database()
		.ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
		.once('value', snap => {
			resolve(snap.val())
		}, reject)
	});
}

/* Return difference in spell time (ref: checkSpellTime)
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const getSpellTime = function(uniqueID, champion, spell) {
	return checkSpellTime(uniqueID, champion, spell).then(function(snapshot){
		var diff = Date.now()-snapshot
		if (diff >= 300000) {
			return 0;
		}
		return diff;
=======
	return firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell).once('value', snap => {
		const diff = Date.now() - snap.val()
		if (diff >= 300000) {
			return 0;
		}
		// else {
			return diff/1000;
		// }
>>>>>>> updating static spells
	});
}

module.exports = {
  "storeSpellTime"     : storeSpellTime,
  "storeObjectiveTime" : storeObjectiveTime,
  "checkSpellTime" : checkSpellTime,
  "getSpellTime" : getSpellTime
}
