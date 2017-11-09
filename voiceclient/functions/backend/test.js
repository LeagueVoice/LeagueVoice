const foo = require('./client.js');
  console.log(foo.getChampionID('ashe'));
  console.log(foo.getChampionName(22));
  

/*
  foo.getBestMatchupsByLane(18).then(function(matchups) {
    console.log(matchups);
  });
  */

// foo.getGGMatchupsTEST().then(console.log)
  /*

// foo.getBySummonerName('waddlechirp', 'na1').then(function(res) {
//   console.log(res);
// })


foo.getAllLeaguePositionsForSummoner(84289964, 'na1').then(function(res) {
  console.log(res);
})

foo.getRecentMatchList(237254272, "na1").then(function(res) {
	console.log(res)
})

// foo.getMatch(2638457089, "na1").then(function(res) {
// 	console.log(res)
// })

