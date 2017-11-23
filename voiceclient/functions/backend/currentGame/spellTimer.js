const firebase = require('firebase');

const summonerMap = {
	barrier: 180,
	clarity: 180,
	cleanse: 210,
	exhaust: 210,
	flash: 300,
	ghost: 180,
	heal: 240,
	ignite: 210,
	smite: 15,
	teleport: 300
};

/* Store the time when spell expires in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const storeSpellTime = function(uniqueID, champion, spell) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
		.set(Date.now());
};

/* Store the time when objective comes up again in Firebase
 * @param {String} uniqueID - Google Home ID
 * @param {String} objective - objective name to store time for
 */
const storeObjectiveTime = function(uniqueID, objective) {
	firebase.database().ref('users/' + uniqueID + '/currentMatch/objectives/' + objective)
		.set(Date.now());
};

/* Check if time for spell is up again (ref: getSpellTime)
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const checkSpellTime = function(uniqueID, champion, spell) {
	return new Promise((resolve, reject) => {
		firebase.database()
			.ref('users/' + uniqueID + '/currentMatch/players/' + champion + '/' + spell)
			.once('value', snap => {
				resolve(snap.val())
			}, reject);
	});
};

/* Returns the remaining cooldown for spell in seconds
 * @param {String} uniqueID - Google Home ID
 * @param {Int} champion - champion number identifier
 * @param {String} spell - spell used to store time for
 */
const getSpellTime = function(uniqueID, champion, spell) {
	console.log("in get spell time");
	return checkSpellTime(uniqueID, champion, spell)
		.then(snapshot => {
			console.log(snapshot);
			var diff = Date.now() - snapshot;
			var cooldown = summonerMap[spell.toLowerCase()];
			console.log("cooldown" + cooldown);
			if (diff >= cooldown * 1000) {
				return 0;
			}
			// in seconds!
			return cooldown - diff / 1000;
		});
};

module.exports = {
  storeSpellTime,
  storeObjectiveTime,
  checkSpellTime,
  getSpellTime
};
