const foo = require('./client.js');

foo.getBySummonerName('waddlechirp', 'na1').then(function(res) {
  console.log(res);
})

foo.getAllLeaguePositionsForSummoner(84289964, 'na1').then(function(res) {
  console.log(res);
})

foo.getRecentMatchList(237254272, "na1").then(function(res) {
	console.log(res)
})

foo.getMatch(2638457089, "na1").then(function(res) {
	console.log(res)
})
