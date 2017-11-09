const foo = require('./client.js');

foo.getBySummonerName('waddlechirp', 'na1').then(function(res) {
  console.log(res);
})

foo.getAllLeaguePositionsForSummoner(84289964, 'na1').then(function(res) {
  console.log(res);
})
