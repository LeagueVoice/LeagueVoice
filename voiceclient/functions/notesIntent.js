const championNotes = require('./backend/userNotes/championNotes')

const WriteNoteIntent = (app) => {
	championNotes.addChampionNote(app.getUser().userId, app.getArgument('champion'), 0, app.getArgument('note'))
	app.tell('Okay. Next time you play ' + app.getArgument('champion') + ' ask me to remind you ' + app.getArgument('note'))
}

const ReadNoteIntent = (app) => {
	championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')).then(function(note) {
		app.tell(note)
	})
}

module.exports = {
	WriteNoteIntent,
	ReadNoteIntent
}
