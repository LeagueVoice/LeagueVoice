const classification = require('./backend/itemization/classification')
const championRole = require('./backend/itemization/championRole')

const ItemSuggestion = (app) => {
	classification.getItems(app.getUser()['user_id'], app.getArgument('status'), app.getArgument('situation')).then(function(item_list) {
	var i = 0
	var speak_string = "Think about buying these items: "
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
