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

module.exports = {
  "getBySummonerName": getBySummonerName
}

