// const championNotes = require('./backend/userNotes/championNotes')

const ItemWinLoseEqual = (app) => {
	championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')).then(function(note) {
		app.tell(note)
	})
}

module.exports = {
	ItemWinLoseEqual
}
