'use strict';

const firebase = require('firebase');
const client = require('../backend/client.js');

const user = {
  /**
   *  resolves to the user from Firebase.
   *  Can be a JSON or the Firebase ref, depending on getRef parameter
   * @param uniqueID
   * @param getRef if true, resolves to firebase ref, otherwise JSON
   * @returns {Promise}
   */
getById: function (uniqueID, {getRef} = {getRef:false}) {
    return new Promise((resolve, reject) => {
      return firebase.database()
        .ref('users')
        .once('value', function (snapshot) {
          const value = getRef ? snapshot.child(uniqueID).ref : snapshot.val()[uniqueID]
          resolve(value)
        }, reject)
    })
  },
  /**
   * Creates user with summoner info from given summonerName and region
   * With default values
   * @param uniqueID
   * @param summonerName
   * @param region
   */
  createFromSummonerName: function (uniqueID, summonerName, region) {
    if (!summonerName || !region) {
      throw new ReferenceError(`summonerName or region missing - summonerName: ${summonerName}, region: ${region}`)
    }
    return client.getBySummonerName(summonerName, region)
      .then(function (res) {
        return user.getById(uniqueID, {getRef: true}).then(function(userRef) {
          return userRef.set({
          "champion": "default",
          "item": {
            "0": "temp"
          },
          "match_history": {
            "match": {
              "0": "default" // win or loss
            },
            "winrate": "default"
          },
          "region": region,
          "summonerID": res.id,
          "accountID": res.accountId,
          "summonerName": summonerName
        });
      })
    })
  },

  /* Add new matches to user match history
   * @param {String} uniqueID
   * @param {JSON} matchID
   * @returns void
   */
  updateMatchHistory: function (uniqueId, matchID) {
    let finishedRunning = false;
    let ref = user.getById(uniqueId, {getRef: true}).child('/match_history/match')
    let currentMatchIDs = []
    ref.once('value', function (snap) {
      snap.forEach(function (item) {
        let matchResults = item.val();
        currentMatchIDs.push(matchResults);
      });

      for (var i = 0; i < matchID.length; i++) { // << highkey probably not work?
        for (let ID in currentMatchIDs) {
          if (!(currentMatchIDs.includes(matchID[i].gameId))) {
            firebase.database().ref('/' + uniqueID + '/match_history/' + snap.numChildren()).update({
              [snap.numChildren().toString()]: allM[i].wordcount
            });
          }
        }
      }
    });
  }
}

module.exports = user;