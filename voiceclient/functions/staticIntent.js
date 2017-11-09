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
  .then(JSON.parse)
  .then(json => json.data);

const abilitiesIndicies = [ 'Q', 'W', 'E', 'R' ];

function _getChampion(championKey) {
  return latest
    .then(version => req(`${CDN}${version}/data/en_US/champion/${championKey}.json`))
    .then(JSON.parse)
    .then(json => json.data[championKey]);
}
function _getChampionAbility(championKey, ability) {
  if ('passive' === ability) {
    return _getChampion(championKey)
      .then(champ => champ.passive);
  }
  else {
    return _getChampion(championKey)
      .then(champ => champ.spells)
      .then(abilities => abilities[abilitiesIndicies.indexOf(ability)]);
  }
}

function _cooldownToString(arr) {
  // Constant cooldown.
  if ((new Set(arr)).size === 1)
    return `${arr[0]} seconds at all levels`;
  // Linear cooldown.
  let deltas = [];
  for (let i = 1; i < arr.length; i++)
    deltas.push(arr[i] - arr[i - 1]);
  if ((new Set(deltas)).size === 1)
    return `${arr[0]} seconds at level 1, decreasing by ${-deltas[0]} seconds per level, to `
      + `${arr[arr.length - 1]} seconds at level ${arr.length}`;
  let strs = arr.map((x, i) => `${x} seconds at level ${i + 1}`);
  strs[strs.length - 1] = 'and ' + strs[strs.length - 1];
  return strs.join(', ');
}

function championAttackRange(assistant) {
  let champion = assistant.getArgument('champion');

  return champs.get(data => {
    let champ = data[champion];
    assistant.tell(`${champ.name}'s auto attack range is ${champ.stats.attackrange}.`);
  });
}

function championAbility(assistant) {
  let champion = assistant.getArgument('champion');
  let ability = assistant.getArgument('ability');

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(list => {
      let [ name, data ] = list;
      assistant.tell(`${name}'s ${ability} is ${data.name}: ${data.description}`);
    });
}

function championAbilityCooldown(assistant) {
  let champion = assistant.getArgument('champion');
  let ability = assistant.getArgument('ability');

  if ('passive' === ability)
    return;

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(list => {
      let [ name, data ] = list;
      assistant.tell(`${name}'s ${ability} cooldown is ${_cooldownToString(data.cooldown)}.`);
    });
}

function championRange()

module.exports = {
  championAbility,
  championAbilityCooldown,
  championAttackRange
};
