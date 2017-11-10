const spellTimer = require('./backend/currentGame/spellTimer');
const gameTimer = require('./backend/currentGame/gameTimer');

const AdviceIntent = (app) => {
	gameTimer.gameTimeAdvice(97, "NA1")
	.then(function(response){
		console.log("intent: " + response)
		app.tell("" + response);
	})
}

const SummonerSpellStoreIntent = (app) => {
	spellTimer.storeSpellTime(32, app.getArgument('champion'), app.getArgument('spell'))
	app.tell("Got it! Noted that " + app.getArgument('champion') + " used " + app.getArgument('spell') + ". Check in whenever to find out the status!")
}

const SummonerSpellGetIntent = (app) => {
	spellTimer.getSpellTime(32, app.getArgument('champion'), app.getArgument('spell'))
	.then(function(response){
		var baseString = app.getArgument('champion') + " will have " + app.getArgument('spell') + " in " + Math.round(response) + " seconds. "
		console.log(['Flash', 'Heal', 'Barrier', 'Cleanse'].includes(app.getArgument('spell')))
		if (['Flash', 'Heal', 'Barrier', 'Cleanse'].includes(app.getArgument('spell'))){
			if (response == 0){
			app.tell(app.getArgument('champion') + " has " + app.getArgument('spell') + " up! They may " + app.getArgument('spell') + " if you engage.")
			}
			else if (response < 10) {
				app.tell(baseString + ". Get ready!")
			}
			else if (response < 100) {
				app.tell(baseString + " Let your team know and if you want to coordinate a gank!")
			}
			else {
				app.tell(baseString + " Take your time to find the right moment to engage!")
			}
		}
		else {
			if (response == 0){
			app.tell(app.getArgument('champion') + " has " + app.getArgument('spell') + " up!")
			}
			else {
				app.tell(baseString)
			}
		}
	})
}

module.exports = {
	AdviceIntent, SummonerSpellStoreIntent, SummonerSpellGetIntent
}