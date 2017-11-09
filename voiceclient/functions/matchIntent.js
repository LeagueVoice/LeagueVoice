const spellTimer = require('./backend/currentGame/spellTimer');

const AdviceIntent = (app) => {
	
}

const SummonerSpellStoreIntent = (app) => {
	spellTimer.storeSpellTime(23, app.getArgument('champion'), app.getArgument('spell'))
	app.tell("I saved that " + app.getArgument('champion') + " used " + app.getArgument('spell'))
}

const SummonerSpellGetIntent = (app) => {
	console.log(app.getArgument('champion') + " " + app.getArgument('spell'))
	spellTimer.getSpellTime(23, app.getArgument('champion'), app.getArgument('spell'))
	.then(function(response){
		console.log(response)
		app.tell(app.getArgument('champion') + " will have " + app.getArgument('spell') + " in " + Math.round(response / 1000) + " seconds")
	})
}

module.exports = {
	AdviceIntent, SummonerSpellStoreIntent, SummonerSpellGetIntent
}