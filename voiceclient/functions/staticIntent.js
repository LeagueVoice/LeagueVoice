const rp = require('request-promise');

// "Cached" permanently.
const versions = rp('https://ddragon.leagueoflegends.com/api/versions.json')
  .catch(e => rp('https://ddragon.leagueoflegends.com/api/versions.json')) // 1 retry.
  .then(JSON.parse);

const champs = versions
  .then(versions => versions[0])
  .then(version => rp(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)
    .catch(e => rp(`http://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`)))
  .then(JSON.parse);

function championAbility(assistant) {
  return champs
    .then(champs => {
      let champion = assistant.getArgument('champion');
      let ability = assistant.getArgument('ability');
      assistant.tell(`What is ${champion}'s ${ability}? I don't know`);
    });
}

module.exports = {
  championAbility
};
