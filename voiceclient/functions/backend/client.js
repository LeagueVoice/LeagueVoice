const rp = require('request-promise');

// Location of express service serving apiproxy.
var APIPROXY = 'http://104.196.43.62:3000';

// Returns a promise for getBySummonerName that resolves to the returned JSON
// from the Riot API.
getBySummonerName = function(name, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/summoner/getBySummonerName/' + name,
    json: true
  }
  return rp(options)
}

// Returns a promise for getRecentMatchList that resolves to the returned JSON
// from the Riot API matchlists/by-account/./recent endpoint.
getRecentMatchList = function(accountID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/match/getRecentMatchlist/' + accountID,
    json: true
  }
  return rp(options)
}

// Returns a promise for getMatch that resolves to the returned JSON from the
// Riot API matches/. endpoint.
getMatch = function(matchID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/match/getMatch/' + matchID,
    json: true
  }
  return rp(options)
}

// Returns a promise for getAllLeaguePositionsForSummoner that resolves to the
// returned JSON from the Riot API positions/by-summoner/. endpoint.
getAllLeaguePositionsForSummoner = function(summonerID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/league/getAllLeaguePositionsForSummoner/' + summonerID,
    json: true
  }
  console.log(options)
  return rp(options)
}

getAllChampionMasteriesForSummoner = function(summonerID, region) {
	const options = {
		method: 'GET',
		uri: `${APIPROXY}/rgapi/${region}/championMastery/getAllChampionMasteries/${summonerID}`,
		json: true
	}
	return rp(options)
}

/**
 * returns Promise resolving into championGG Champion data, sorted by winrate (descending)
 * @param position {'MIDDLE' | 'JUNGLE' | 'TOP' | 'DUO_CARRY' | 'DUO_SUPPORT'}
 * @param rank {'BRONZE' |  'SILVER' |  'GOLD' |  'PLATINUM'  | 'DIAMOND'  | 'MASTER' |  'CHALLENGER'} = 'PLATINUM'
 */
getGGChampionsForRole = function (position, rank = 'PLATINUM') {
  const options = {
    method: 'GET',
    uri: `${APIPROXY}/cggapi/champions?elo=${rank}&sort=winRate-desc`,
    json: true
  }
  return rp(options).then(champions => {
    return champions.filter(champion => champion.role === position)
  })
}

// Returns an approximate "Sharpe" on winrate versus 50%.
rateSignificance = function(winrate, n) {
  return (n * winrate - 0.5) / Math.sqrt(n * 0.5 * 0.5)
}

// Returns a list of matchups sorted in descending order of popularity by
// position. Each position contains a list of matchups sorted in descending
// order by winrate significance. In other words, the first element of the
// first element is the highest winrate against the given champion for the most
// popular role. Winrate is expressed from perspective of the non-queried champion.
getBestMatchupsByLane = function(championID, rank = 'PLATINUM') {
  const options = {
    method: 'GET',
    uri: `${APIPROXY}/cggapi/matchupsByChamp/${championID}?elo=${rank}&limit=100`,
    json: true
  }
  return rp(options).then(function(matchups) {
    let roles = ['DUO_CARRY', 'DUO_SUPPORT', 'MIDDLE', 'TOP', 'JUNGLE'];
    let byRole = roles.map(function(role) {
      let forRole = matchups.filter(function(element) {
        return element._id.role == role;
      });

      forRole = forRole.map(function(elem) {
        // Normalize so that the winrate is with respect to the non-queried
        // champion.
        let otherChamp = elem.champ2_id;
        let winrate = elem.champ2.winrate;
        if (otherChamp == championID) {
          otherChamp = elem.champ1_id;
          winrate = elem.champ1.winrate;
        }
        return {
          count: elem.count,
          championID: otherChamp,
          winrate: winrate
        };
      });

      // Sort descending by significance of winrate.
      forRole.sort(function(a, b) {
        let sigA = rateSignificance(a.winrate, a.count);
        let sigB = rateSignificance(b.winrate, b.count);

        if (sigA < sigB) {
          return 1;
        }
        if (sigA > sigB) {
          return -1;
        }
        return 0;
      });

      let counts = forRole.map(function(elem) {
        return elem.count;
      });

      return {
        role: role,
        count: counts.reduce((a, b) => a+b, 0),
        matchups: forRole
      };
    });

    // Sort descending by popularity of the role.
    return byRole.sort(function(a, b) {
      if (a.count < b.count) {
        return 1;
      }
      if (a.count > b.count) {
        return -1;
      }
      return 0;
    });
  });
}

module.exports = {
	"getBySummonerName": getBySummonerName,
	"getRecentMatchList": getRecentMatchList,
	"getMatch": getMatch,
	"getAllLeaguePositionsForSummoner": getAllLeaguePositionsForSummoner,
	"getAllChampionMasteriesForSummoner": getAllChampionMasteriesForSummoner,
  "getGGChampionsForRole": getGGChampionsForRole,
  "getBestMatchupsByLane": getBestMatchupsByLane
}

