const enemyTips = require('./backend/userNotes/enemyTips');
const client = require('./backend/client');
const user = require('./firebase/user');

const EnemyTipsIntent = (app) => {
	user.getById(app.getUser()["user_id"])
		.then(snapshot => {
			console.log(snapshot);
			console.log(snapshot.summonerID);
			return client.getCurrentMatch(snapshot.summonerID);
		})
		.then(match => {
			let participant = match.participants.find(elem => elem.summonerId == snapshot.summonerID);
			return enemyTips.getTipsAgainst(app.getArgument('champion'), client.getChampionName(participant.championId));
		})
		.catch(e => enemyTips.getTipsAgainst(app.getArgument('champion')))
		.then(response => {
			if (response.length !== 0) {
				app.ask("According to LoL Counter, " + response[0]);
			}
			else {
				app.tell("I could not find reliable tips from LoL Counter for this champ! Ripperoni.");
			}
		});
}

module.exports = {
	EnemyTipsIntent
};
