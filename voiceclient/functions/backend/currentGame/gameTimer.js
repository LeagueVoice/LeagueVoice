const client = require('../client')
const rp = require('request-promise');

timeLogic = function(gameLength) {
	const gameTimerEnum = {
		MIDGAME : 1200,
		LATEGAME : 1800
	}

	if (gametime < gameTimerEnum.MIDGAME){
		return "It is still early game! Focus on your lane."
	}
	else if (gametime > gameTimerEnum.MIDGAME && gametime < gameTimerEnum.LATEGAME){
		return "It is mid game! Look to group with your team and push inner turrets."
	}
	else{
		return "It is late game! Be aware of major objectives like Baron and Elder."
	}
}

gameTimeAdvice = function (uniqueID, region) {
	const userCurrentGamePromise = client.getCurrentMatch(uniqueID, region).then(function(response){
		console.log(response)
		console.log(response.gameLength)
		return timeLogic(response.gameLength);
	})
}


module.exports = {
	"gameTimeAdvice": gameTimeAdvice
}