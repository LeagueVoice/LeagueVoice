const classification = require('./backend/itemization/classification');
const championRole = require('./backend/itemization/championRole');

const ItemSuggestion = (app) => {
	classification.getItems(app.getUser()['user_id'], app.getArgument('status'), app.getArgument('situation'))
		.then(itemList => {
			let i = 0;
			let speakString = "Think about buying these items: ";
			for (; i < item_list.length - 2; i++) {
				speakString += itemList[i] + ', ';
			}
			speakString += itemList[i] + " " + itemList[i + 1];
			speakString += ". Good luck!";
			app.ask(speakString);
		})
		.catch(e => app.tell("I can't suggest an item for you right now. Set up your summoner with me and make sure you're in a game."));
};

module.exports = {
	ItemSuggestion
};
