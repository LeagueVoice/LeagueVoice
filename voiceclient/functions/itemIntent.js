const classification = require('./backend/itemization/classification')
const championRole = require('./backend/itemization/championRole')

const ItemSuggestion = (app) => {
	classification.getItems(app.getUser()['user_id'], app.getArgument('status'), app.getArgument('situation'))
	.then(function(item_list) {
		var i = 0
		var speak_string = "Think about buying these items: "
		for (; i < item_list.length-2; i++) {
				speak_string+= item_list[i] + ', '
			}
			speak_string+= item_list[i] + " " + item_list[i+1]
			speak_string+= ". Good luck!"
			app.ask(speak_string)
		})
	.catch(function(e) {
		app.tell("I can't suggest an item for you right now. Set up your summoner with me and make sure you're in a game.")
	})
}

module.exports = {
	ItemSuggestion
}
