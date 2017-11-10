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

// Formats an array of values.
// Used for ability cooldowns, damage, costs,
// things which may change per level.
function _formatValues(arr, units) {
  // Constant.
  if ((new Set(arr)).size === 1)
    return `${arr[0]} ${units} at all levels`;
  // Linear.
  let deltas = [];
  for (let i = 1; i < arr.length; i++)
    deltas.push(arr[i] - arr[i - 1]);
  if ((new Set(deltas)).size === 1) {
    let delta = deltas[0];
    let order = delta < 0 ? 'decreasing' : 'increasing';

    return `${arr[0]} ${units} at level 1, ${order} by ${Math.abs(delta)} ${units} per level, to `
      + `${arr[arr.length - 1]} ${units} at level ${arr.length}`;
  }
  let strs = arr.map((x, i) => `${x} ${units} at level ${i + 1}`);
  strs[strs.length - 1] = 'and ' + strs[strs.length - 1];
  return strs.join(', ');
}

function _cooldownToString(arr) {
  return _formatValues(arr, 'seconds');
}

function championCount(assistant) {
  return champs.then(data =>
    assistant.tell(`There are ${Object.keys(data).length} champions.`));
}

function championAttackRange(assistant) {
  let champion = assistant.getArgument('champion');

  return champs.then(data => {
    let champ = data[champion];
    assistant.tell(`${champ.name}'s auto attack range is ${champ.stats.attackrange} units.`);
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
    return; //TODO

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(([ name, data ]) => {
      assistant.tell(`${name}'s ${ability} cooldown is ${_cooldownToString(data.cooldown)}.`);
    });
}

function championAbilityCost(assistant) {
  let champion = assistant.getArgument('champion');
  let ability = assistant.getArgument('ability');

  if ('passive' === ability)
    return; //TODO

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(([ name, data ]) => {
      let costType = data.costType.trim().toLowerCase();
      if ('no cost' === costType)
        assistant.tell(`${name}'s ${ability} has no cost.`);
      else if (data.costType === data.resource) // '1 seed'
        assistant.tell(`${name}'s ${ability} costs ${data.costType}.`);
      else {
        let costArr = data.cost;
        let costStr = _formatValues(costArr, costType);
        assistant.tell(`${name}'s ${ability} costs ${costStr}.`);
      }
    });
}

module.exports = {
  championAbility,
  championAbilityCooldown,
  championAttackRange,
  championCount,
  championAbilityCost,

  _formatValues
};
