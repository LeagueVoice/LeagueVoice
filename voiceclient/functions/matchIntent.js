const spellTimer = require('./backend/currentGame/spellTimer');
const gameTimer = require('./backend/currentGame/gameTimer');

const AdviceIntent = (app) => {
	gameTimer.gameTimeAdvice(32, "NA1")
	.then(function(response){
		console.log("intent: " + response)
		app.tell("" + response);
	})
}

const SummonerSpellStoreIntent = (app) => {
	//23 --> app.user().userId
	spellTimer.storeSpellTime(32, app.getArgument('champion'), app.getArgument('spell'))
	app.tell("I saved that " + app.getArgument('champion') + " used " + app.getArgument('spell'))
}

const SummonerSpellGetIntent = (app) => {
	//console.log(app.getArgument('champion') + " " + app.getArgument('spell'))
	//23 --> app.user().userId
	spellTimer.getSpellTime(32, app.getArgument('champion'), app.getArgument('spell'))
	.then(function(response){
		console.log(response)
		app.tell(app.getArgument('champion') + " will have " + app.getArgument('spell') + " in " + response + " seconds")
	})
}

module.exports = {
	AdviceIntent, SummonerSpellStoreIntent, SummonerSpellGetIntent
}