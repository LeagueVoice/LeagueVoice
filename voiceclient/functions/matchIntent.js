const spellTimer = require('./backend/currentGame/spellTimer');
const gameTimer = require('./backend/currentGame/gameTimer');
const client = require('./backend/client');
const championRecord = require('./backend/currentGame/championRecord');

const EnemyInfoIntent = (app) => {
	championRecord.getChampionRecord(app.getUser()["user_id"], client.getChampionID(app.getArgument('champion').toLowerCase()))
		.then(response => {
			//console.log(response)
			app.ask(`The ${app.getArgument('champion')} has a winrate of ${Math.round(response['winrate'] * 100)} percent and champion mastery level ${response['championLevel']}.`);
		})
		.catch(e => app.tell("I can't help you look up the enemy right now. Set up your summoner with me and make sure you're in a game."));
};

const AdviceIntent = (app) => {
	gameTimer.gameTimeAdvice(app.getUser()["user_id"], "NA1")
		.then(response => {
			app.ask("" + response);
		})
		.catch(e => app.tell("I can't give advice right now. Set up your summoner with me and make sure you're in a game."));
};

const SummonerSpellStoreIntent = (app) => {
	spellTimer.storeSpellTime(app.getUser()["user_id"], app.getArgument('champion'), app.getArgument('spell'));
	app.ask(`Got it! Noted that ${app.getArgument('champion')} used ${app.getArgument('spell')}. Check in whenever to find out the status!`);
};

const SummonerSpellGetIntent = (app) => {
	spellTimer.getSpellTime(app.getUser()["userId"], app.getArgument('champion'), app.getArgument('spell'));
	.then(response => {
		var baseString = app.getArgument('champion') + " will have " + app.getArgument('spell') + " in " + Math.round(response) + " seconds. ";
		console.log(['Flash', 'Heal', 'Barriestopr', 'Cleanse'].includes(app.getArgument('spell')));
		if (['Flash', 'Heal', 'Barrier', 'Cleanse'].includes(app.getArgument('spell'))) {
			if (response == 0) {
				app.ask(app.getArgument('champion') + " has " + app.getArgument('spell') + " up! They may " + app.getArgument('spell') + " if you engage.");
			}
			else if (response < 10) {
				app.ask(baseString + ". Get ready!");
			}
			else if (response < 100) {
				app.ask(baseString + " Let your team know and if you want to coordinate a gank!");
			}
			else {
				app.ask(baseString + " Take your time to find the right moment to engage!");
			}
		}
		else {
			if (response == 0){
				app.ask(app.getArgument('champion') + " has " + app.getArgument('spell') + " up!");
			}
			else {
				app.ask(baseString);
			}
		}
	})
	.catch(e => app.tell("I can't get that timer for you. Make sure that your summoner is registered with me first."));
};

module.exports = {
	AdviceIntent,
	SummonerSpellStoreIntent,
	SummonerSpellGetIntent,
	EnemyInfoIntent
};
