module.exports = function(context) {
  const aggregate = require('../backend/aggregate');

  context.register('lookup.SummonerInfo').asFunction({
    deps: [ 'assistant', 'firebase.summonerData' ],
    func({ assistant, 'firebase.summonerData': summonerData }) {
      if (!summonerData) {
        assistant.ask("You haven't registered a summoner yet.");
        return;
      }
      assistant.ask(`Your summoner is ${summonerData.name} in ${summonerData.platformId}.`);
    }
  });

  context.register('lookup.UserRanks').asFunction({
    deps: [ 'assistant' ],
    func({ assistant, numeralEnum }) {
      aggregate.userRanksByQueue(assistant.getUser()['user_id'])
        .then(res => {
          let rankArray = res["RANKED_SOLO_5x5"].split(" ")
          let rankStr = rankArray[0].toLowerCase() + " " + numeralEnum[rankArray[1]]
          if (rankArray[0] !== "CHALLENGER") {
            assistant.ask("You're a " + rankStr + " player. Let's work to get you even higher!");
          }
          else {
            assistant.ask("You're a " + rankStr + " player. Please teach me how to play, senpai.");
          }
        })
        .catch(e => assistant.ask("I can't get your rank right now. Set up your summoner with me first."));
    },
    params: {
      numeralEnum: {
        "I": "1",
        "II": "2",
        "III": "3",
        "IV": "4",
        "V": "5"
      }
    }
  });
};
