const foo = require('./client.js');

// foo.getBySummonerName('waddlechirp', 'na1').then(function(res) {
//   console.log(res);
// })

foo.getAllLeaguePositionsForSummoner(84289964, 'na1').then(function(res) {
  console.log(res);
})

foo.getRecentMatchList(237254272, "na1").then(function(res) {
	console.log(res)
})

<<<<<<< HEAD
// foo.getMatch(2638457089, "na1").then(function(res) {
// 	console.log(res)
// })

// get champion wrnrates
// --------------------------------------------------------
// log champion winrate by id's
// --------------------------------------------------------
// get match stats for game match name
// find match from champion id in recentmatches where championid is equal and

// getRecent > championID
// participants > teamID
// teams > win

// find what team participantid was on from the participants place to find team id from champion id
=======
foo.getMatch(2638457089, "na1").then(function(res) {
	console.log(res)
})
>>>>>>> 7754250d7d13d8ddb448e38a34d1aab76d3f3eec
