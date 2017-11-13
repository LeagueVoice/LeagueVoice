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
 	        //console.log(client.getChampionName(participant.championId))
			enemyTips.getTipsAgainst(app.getArgument('champion'), client.getChampionName(participant.championId))
			.then(function(response){
				//console.log(response)
				if (response.length !== 0) {
					app.ask("According to LoL Counter, " + response[0])
				}
				else {
					app.tell("I could not find reliable tips from LoL Counter for this champ! Ripperoni.")
				}
			})
			.catch(function(e){
				console.log(e)
			})
		})
		.catch(function(e, match){
			enemyTips.getTipsAgainst(app.getArgument('champion'))
			.then(function(response){
				console.log(response)
				if (response.length !== 0) {
					app.ask("According to LoL Counter, " + response[0])
				}
				else {
					app.tell("I could not find reliable tips from LoL Counter for this champ! Ripperoni.")
				}			
			})
		})
	})
}

module.exports = {
	EnemyTipsIntent
}