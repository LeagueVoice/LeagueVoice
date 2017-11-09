const rp = require('request-promise');

function req(url) {
  return rp(url)
    .catch(e => rp(url));
}

const CDN = 'http://ddragon.leagueoflegends.com/cdn/';

// "Cached" permanently.
const versions = req('https://ddragon.leagueoflegends.com/api/versions.json')
  .then(JSON.parse);
const latest = versions.then(versions => versions[0]);

const champs = latest
  .then(version => rp(`${CDN}${version}/data/en_US/champion.json`))
  .then(JSON.parse);

const abilitiesIndicies = [ 'Q', 'W', 'E', 'R', 'passive' ];

function _getChampionAbilities(championKey) {
  return latest
    .then(version => req(`${CDN}${version}/data/en_US/champion/${championKey}.json`))
    .then(JSON.parse)
    .then(json => json.data[championKey].spells);
}

function championAbility(assistant) {
    let champion = assistant.getArgument('champion');
    let ability = assistant.getArgument('ability');

    let champName = champs.then(json => json.data[champion].name);
    let champData = _getChampionAbilities(champion)
      .then(abilities => abilities[abilitiesIndicies.indexOf(ability)]);

    return Promise.all([ champName, champData ])
      .then(list => {
        let [ name, data ] = list;
        assistant.tell(`${name}'s ${ability} is ${data.name}: ${data.description}`);
      });
}

module.exports = {
  championAbility
};
