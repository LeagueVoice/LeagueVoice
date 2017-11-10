const client = require('../client')
const user = require('../../firebase/user')
const rp = require('request-promise');

timeLogic = function(gameLength) {
	const gameTimerEnum = {
		MIDGAME : 1200,
		LATEGAME : 1800
	}

	if (gameLength < gameTimerEnum.MIDGAME){
		return new Promise((resolve, reject)=>{
			resolve("It is still early game! Focus on your lane.")
		})
	}
	else if (gameLength > gameTimerEnum.MIDGAME && gameLength < gameTimerEnum.LATEGAME){
		return new Promise((resolve, reject)=>{
			resolve("It is mid game! Look to group with your team and push inner turrets.")
		})
	}
	else {
		return new Promise((resolve, reject)=>{
			resolve("It is late game! Be aware of major objectives like Baron and Elder.")
		})
	}
}

const gameTimeAdvice = function (uniqueID, region) {
	return user.getById(uniqueID)
	.then(function(response){
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