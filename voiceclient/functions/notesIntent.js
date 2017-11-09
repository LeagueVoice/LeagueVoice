const championNotes = require('./backend/userNotes/championNotes')

const WriteNoteIntent = (app) => {
	championNotes.addChampionNote(app.getUser().userId, app.getArgument('champion'), 0, app.getArgument('note'))
	app.tell('Okay. Next time you play ' + app.getArgument('champion') + ' ask me to remind you ' + app.getArgument('note'))
}

const ReadNoteIntent = (app) => {
	big_string = ""
	championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')).forEach(function (note) {
		big_string+= note + "."
	})
	app.tell(big_string)
}

module.exports = {
	WriteNoteIntent,
	ReadNoteIntent
}