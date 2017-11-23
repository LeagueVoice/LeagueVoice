const client = require('./client')
const fbUser = require('../firebase/user')

const aggregate = {

  /** resolves into all championMastery entries for the user with given ID */
  userChampionMasteries: function(uniqueID) {
    return fbUser.getById(uniqueID)
      .then(user => client.getAllChampionMasteriesForSummoner(user['summonerID'], user['region']));
  },

// Returns a promise that resoves to a map from queue type to string rank
// within that league. The input user uniqueID is assumed to correspond to a
// user that has already been created.
  userRanksByQueue: function(uniqueID) {
    return fbUser.getById(uniqueID)
      .then(snapshot => {
        console.log(snapshot);
        return client.getAllLeaguePositionsForSummoner(snapshot.summonerID, snapshot.region);
      })
      .then(positions => {
        let byQueue = {};
        positions.forEach(pos => byQueue[pos["queueType"]] = pos["tier"] + " " + pos["rank"]);
        return byQueue;
      });
  }
};

module.exports = aggregate;
