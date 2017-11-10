const firebase = require('firebase');
const client = require('../client.js');

// For the game that the user ID is in, return the record for the given
// champion ID in that game.
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
          return {
            id: participant.summonerId,
            region
          };
        });
      }).then(function(participant) {
        return client.getBySummonerId(participant.id, participant.region)
          .then(function(res) {
            return {
              id: res.accountId,
              region: participant.region
            };
          });
      }).then(function(participant) {
        return client.getMatchlistForQueue(participant.id, participant.region, championID)
          .then(function(res) {
            return Promise.all(res.matches.map(function(e) {
              return client.getMatch(e.gameId, participant.region);
            })).then(function(matches) {
              return {
                participant,
                matches
              };
            });
          });
      }).then(function(matches) {
        let isWin = matches.matches.map(function(match) {
          let participantID = match.participantIdentities.find(function(i) {
            return i.player.accountId == matches.participant.id;
          }).participantId;

          let participant = match.participants.find(function(i) {
            return i.participantId == participantID;
          });

          let team = match.teams.find(function(i) {
            return i.teamId == participant.teamId;
          });

          return team.win == 'Win';
        });

        return isWin.reduce((a, b) => a + b, 0) / isWin.length;
      });
};

module.exports = {
  getChampionRecord
}
