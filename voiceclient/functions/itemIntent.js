const classification = require('./backend/itemization/classification')
const championRole = require('./backend/itemization/championRole')

const ItemSuggestion = (app) => {
	championRole.getCurrentChampionRole(app.getUser()['user_id']).then(function(role) {
		var i = 0
		var speak_string = "Think about buying these items: "
		var item_list = classification.getItemClassification(role, app.getArgument('status'), app.getArgument('situation'))
		for (; i < item_list.length-1; i++) {
			speak_string+= item_list[i] + ','
		}
		speak_string+= item_list[i] + ". Good luck!"
		if (speak_string === "Some items that we suggest are") {
			app.tell("We didn't find any items for you. Good luck!")
		} else {
			app.tell(speak_string)
		}
	})
}

module.exports = {
	ItemSuggestion
}
