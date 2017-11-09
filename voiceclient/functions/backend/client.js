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


module.exports = {
	"getBySummonerName": getBySummonerName,
	"getRecentMatchList": getRecentMatchList,
	"getMatch": getMatch,
	"getAllLeaguePositionsForSummoner": getAllLeaguePositionsForSummoner,
	"getAllChampionMasteriesForSummoner": getAllChampionMasteriesForSummoner
}

