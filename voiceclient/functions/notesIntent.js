const championNotes = require('./backend/userNotes/championNotes')

const WriteNoteIntent = (app) => {
	championNotes.addChampionNote(app.getUser().userId, app.getArgument('champion'), 0, app.getArgument('note'))
	app.tell('Okay. Next time you play ' + app.getArgument('champion') + ' ask me to remind you ' + app.getArgument('note'))
}

const ReadNoteIntent = (app) => {
	// big_string = ""
	// championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')).forEach(function (note) {
	// 	big_string+= note + "."
	// })
<<<<<<< HEAD
	app.tell(championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')))
=======
	app.tell(championNotes.getChampionNotes(app.getUser().userId, app.getArgument('champion')));
>>>>>>> fix arg list
}

module.exports = {
	WriteNoteIntent,
	ReadNoteIntent
}
