const ml = require('ml-regression');
const csv = require('csvtojson');
var fs = require('fs');
const client = require('../client.js');
const readline = require('readline');
const SLR = ml.SLR;

let csvData = [], // parsed Data
    X = [], // Input
    y = []; // Output

var regressionModel;

function performRegression() {
	return new Promise((resolve, reject)=>{
	    regressionModel = new SLR(X, y); // Train the model on training data
	    console.log(regressionModel.toString(3));
	    resolve(predictOutput(2341));
    });
}

function dressData() {
    csvData.forEach((row) => {
    	console.log(row)
        X.push(parseFloat(row.time));
        y.push(parseFloat(row.win));
    });
}

function f(s) {
    return parseFloat(s);
}

function predictOutput(answer) {
	console.log(`At X = ${answer}, y =  ${regressionModel.predict(parseFloat(answer))}`);
	console.log(X)
	console.log(y)
}
// 230957428, "na1"
function getSurrender(summonerID, region) {
return client.getMatchList(summonerID, region).then(res => {
	// console.log(res)

	let championId = []
	let gameId = []
	let lane = []

	for (let key of res["matches"]) {
		// console.log("YAHLLOOOOO " + JSON.stringify(key))
		championId.push(key["champion"]) // list of champions for each game
		gameId.push(key["gameId"])
		lane.push(key["lane"])
	}

	let status = []
	let count = 0
	for (let game of gameId) { // every game: gameId[index]
		const index = gameId.indexOf(game) // index for game data
		return client.getMatch(game, region)
			.then(res => {
				// console.log(res)
				for (let key of res["participants"]) {
					let winStatus;
					// console.log("X: " + res["gameDuration"])
					if (key["championId"] !== championId[index])
						continue;
					if (key["teamId"] == 100) {
						status.push(res["teams"][0]["win"])
					}
					else {
						status.push(res["teams"][1]["win"])
					}

					if (status[index] == 'Win') {
						winStatus = 1
					}
					else {
						winStatus = 0
					}

					// console.log("Y: " + winStatus)
					fs.appendFile("data.csv", [count, res["gameDuration"], winStatus + "\n"]);
					count += 1
					break;
				}
				// console.log("asjdkfl")
			})
	}
	}).then(res => {
		csv()
	    .fromFile("data.csv")
	    .on('json', (jsonObj) => {
	        csvData.push(jsonObj);
	    })
	    .on('done', () => {
	        dressData();
	        return performRegression(234); 
	    });
	})
}

module.exports = {
	getSurrender,
	performRegression,
	dressData,
}