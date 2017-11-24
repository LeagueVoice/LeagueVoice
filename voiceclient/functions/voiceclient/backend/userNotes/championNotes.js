const firebase = require('firebase-admin');

// Returns the database key for the user and champion ID.
const championNoteKey = function(uniqueID, championID) {
  return 'users/' + uniqueID + '/userNotes/champion/' + championID;
}

// Returns a promise for an array of all notes for the user for the given
// champion.
// 
// If inGameSeconds == 0, then the note should be delivered during or
// immediately after champion selection.
const getChampionNotes = function(uniqueID, championID) {
  return firebase.database()
    .ref(championNoteKey(uniqueID, championID))
    .once('value')
    .then(function(snapshot) {
        if (snapshot.val() == null) {
          return 'You do not have a note for ' + championID + ' set.';
        } else {
          return "Here's your note for " + championID + ": " + snapshot.val()['note']
      }
    });
}

// Adds a champion note for the user and champion that should be delievered
// after the given number of seconds. If inGameSeconds is zero, then the note
// should be delievered during or immediately after champion selection.
const addChampionNote = function(uniqueID, championID, inGameSeconds, note) {
  return firebase.database()
    .ref(championNoteKey(uniqueID, championID))
    .set({
      seconds: inGameSeconds,
      note: note
    });
}

module.exports = {
  getChampionNotes,
  addChampionNote
};
