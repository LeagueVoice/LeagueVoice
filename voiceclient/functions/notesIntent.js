const championNotes = require('./backend/userNotes/championNotes')

const WriteNoteIntent = (app) => {
	championNotes.addChampionNote(app.getUser().userId, app.getArgument('champion'), 0, app.getArgument('note'))
	app.ask('Okay. Next time you play ' + app.getArgument('champion') + ' ask me to remind you ' + app.getArgument('note'))
}

const ReadNoteIntent = (app) => {
	championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion'))
	.then(function(note) {
		app.ask(note)
	})
	.catch(function(e) {
		app.tell("Sorry, we can't read notes for you right now. Make sure that you've registered your summoner with me.")
	})
}

module.exports = {
	WriteNoteIntent,
	ReadNoteIntent
}
