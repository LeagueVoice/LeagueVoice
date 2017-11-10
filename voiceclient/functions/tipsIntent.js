const enemyTips = require('./backend/userNotes/enemyTips')
const client = require('./backend/client')
const user = require('./firebase/user')

const EnemyTipsIntent = (app) => {
	user.getById(app.getUser()["user_id"])
	.then(function(snapshot){
		console.log(snapshot)
		console.log(snapshot.summonerID)
		client.getCurrentMatch(snapshot.summonerID)
		.then(function(match){
			let participant = match.participants.find(function(elem) {
 	           return elem.summonerId == snapshot.summonerID;
 	        })
 	        console.log(participant)
 	        console.log(participant.championId)
			enemyTips.getTipsAgainst(app.getArgument('champion'), client.getChampionName(participant.championId))
			.then(function(response){
				console.log(response)
				app.tell(response[0])
			})
		})
	})
}

module.exports = {
	EnemyTipsIntent
}