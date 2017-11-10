const firebase = require('firebase');

getChampionRecord = function(uniqueID, championID) {
  return firebase.database()
      .ref("users/" + uniqueID)
      .once("value").then(function(snapshot) {
        let id = snapshot.val().summonerID;
        let region = snapshot.val().region;
        return client.getCurrentMatch(id, region).then(function(match) {
          let participant = match.participants.find(function(elem) {
            return elem.championId == championID;
          });
          return participant.summonerId;
        });
      }).then(function(summonerID) {
        // What's the record for summonerID for championID?

      });
};
