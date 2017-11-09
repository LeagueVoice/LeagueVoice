const firebase = require('firebase');
const client = require('./client.js');

const user = {
  /**
   *  resolves to the user from Firebase.
   *  Can be a JSON or the Firebase ref, depending on getRef parameter
   * @param uniqueID
   * @param getRef if true, resolves to firebase ref, otherwise JSON
   * @returns {Promise}
   */
  getById: function (uniqueID, {getRef = false}) {
    return new Promise((resolve, reject) => {
      firebase.database()
        .ref('users')
        .once('value', function (snapshot) {
          const value = getRef ? snapshot : snapshot.val()[uniqueID]
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
    if (!summonerName || !region){
      throw new ReferenceError(`summonerName or region missing - summonerName: ${summonerName}, region: ${region}`)
    }
    return client.getBySummonerName(summonerName, region)
      .then(function (res) {
        return user.getById(uniqueID, {getRef: true}).set({
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
  }
}

module.exports = user;