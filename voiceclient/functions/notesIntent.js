const WriteNoteIntent = (app) => {
  app.tell('Okay. Next time you play ' + app.getArguments('champion') + ' ask me to remind you ' + app.getArguments('note'))
}

const ReadNoteIntent = (app) => {

}

module.exports = {
	WriteNoteIntent,
	ReadNoteIntent
}