const client = require('../client')
const user = require('../../firebase/user')
const rp = require('request-promise-native');

timeLogic = function(gameLength) {
	const gameTimerEnum = {
		EARLYGAME : {
			Messages: ["Try to focus on your lane and CS-ing! This will get you lots of cash money to build items and get stronk!",
				"When you take tower, look to roam when other lanes are pushed in! Let's win this as a team!",
				"Drop a few wards to help track the enemy jungler.",
				"Keep in mind the enemy summoner spells to know when to engage and when to play safe. Feel free to ask us for help tracking these!"
			]
		},
		MIDGAME : {
			Time: 900,
			Messages: ["If you're ahead, try to keep waves pushed in and ward the enemy jungle.",
				"If you're ahead, group up with some teammates and roam around the map! Let's take down this enemy team!",
				"Look to fight around objectives like Rift Heralf and dragons! These can snowball into late-game advantages.",
				"Keep farming! You still need items to be a big boye."
			]
		},
		LATEGAME : {
			Time: 1500,
			Messages: ["Your death timers are higher than ever! Avoid wandering alone and without vision on the enemy team.",
				"Objectives like Baron and Elder Drake can make or break a game. Be aware of spawn times and keep vision at all costs (minus dying, and losing the game, and that stuff, you know).",
				"Look at what your enemy team is building and try to build responsively. We can offer suggestions if you need!",
				"If you're dying a lot (hypothetically, of course), recognize how and make items choices accordingly. Hit us up with suggestions!",
				"Be aware of your positioning in team fights. Either be tanking front line or safe in the back tearing through the enemy team!",
				"Vision wins games! Look at pick off enemies with team play and good vision.",
				"Remember your summoners! If you get caught out, don't be afraid to use flash! (cough, Doublelift)"
			]
		}
	}

	if (gameLength < gameTimerEnum.MIDGAME.Time){
		return new Promise((resolve, reject)=>{
			var randMessage = Math.floor((Math.random() * gameTimerEnum.EARLYGAME.Messages.length))
			resolve("We are in early game. " + gameTimerEnum.EARLYGAME.Messages[randMessage])
		})
	}
	else if (gameLength > gameTimerEnum.MIDGAME && gameLength < gameTimerEnum.LATEGAME){
		return new Promise((resolve, reject)=>{
			var randMessage = Math.floor((Math.random() * gameTimerEnum.MIDGAME.Messages.length))
			resolve("We are likely in mid game." + gameTimerEnum.MIDGAME.Messages[randMessage])
		})
	}
	else {
		return new Promise((resolve, reject)=>{
			var randMessage = Math.floor((Math.random() * gameTimerEnum.LATEGAME.Messages.length))
			resolve("We are likely in late game. " + gameTimerEnum.LATEGAME.Messages[randMessage])
		})
	}
}

const gameTimeAdvice = function (uniqueID, region) {
	return user.getById(uniqueID)
	.then(function(response){
		console.log(response)
		return client.getCurrentMatch(response["summonerID"], region)
		.then(function(response){
			return timeLogic(response.gameLength)
			.then(function(response) {
				console.log("in backend: " + response)
				return response;
			});
		})
	})
}


module.exports = {
	"gameTimeAdvice": gameTimeAdvice,
	"timeLogic" : timeLogic
}
