const client = require('./client')
const fbUser = require('../firebase/user')

const aggregate = {

// Returns a promise that resoves to a map from queue type to string rank
// within that league. The input user uniqueID is assumed to correspond to a
// user that has already been created.
  userRanksByQueue : function (uniqueID) { // TODO: remove my_firebase
    return fbUser.getById(uniqueID).then(function (snapshot) {
      console.log(snapshot);
      return client.getAllLeaguePositionsForSummoner(snapshot.summonerID, snapshot.region);
    }).then(function (positions) {
      let byQueue = {};
      positions.forEach(function (pos) {
        byQueue[pos["queueType"]] = pos["tier"] + " " + pos["rank"];
      });
      return byQueue;
    });
  }
}

module.exports = aggregate;