const tracking = require('../tracking');
const client = require('../client');
const helper = require('../helper');
const fbUser = require('../../firebase/user');
const aggregate = require('../aggregate');

const championSelect = {
  /**
   * Resolves into 5 champions for the given role sorted by
   * a) winrate from champion.gg
   * b) amount of championMastery points the user has for the champions
   * @param userPosition 'MIDDLE' | 'TOP' | 'JUNGLE' | 'DUO_CARRY' | 'DUO_SUPPORT'
   */
  suggestChampionToPick: function(uniqueID, userPosition) {
    // get all champions from .gg for the role
    const userChampionMasteriesPromise = aggregate.userChampionMasteries(uniqueID);
    const championsforRoleFromGGPromise = fbUser.getById(uniqueID)
      .then(user => client.getGGChampionsForRole(userPosition, 'BRONZE')); // TODO: actually store users
    return Promise
      .all([
        userChampionMasteriesPromise,
        championsforRoleFromGGPromise
      ])
      .then(([championMasteries, championGGChampions]) => {
        const championMasteriesIDs = championMasteries.map(cmastery => cmastery.championId);
        const championGGIds = championGGChampions.map(champion => champion.championId);

        // match championMastery with highest winrate on champion.gg
        return championGGIds
          .sort((champIdA, champIdB) => helper.sortByAppearanceInArray(championMasteriesIDs, champIdA, champIdB))
          .slice(0, 5);
      });
  }
};

module.exports = championSelect;
