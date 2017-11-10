const rp = require('request-promise');

const formatValues = require('./formatValues');
const ChampionSpell = require('./ChampionSpell');

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
  return formatValues(arr, 'seconds');
}

function championCount(assistant) {
  return champs.then(data =>
    assistant.ask(`There are ${Object.keys(data).length} champions.`));
}

function championAttackRange(assistant) {
  let champion = assistant.getArgument('champion');

  return champs.then(data => {
    let champ = data[champion];
    assistant.ask(`${champ.name}'s auto attack range is ${champ.stats.attackrange} units.`);
  });
}

function championAbility(assistant) {
  let champion = assistant.getArgument('champion');
  let ability = assistant.getArgument('ability');

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(([ name, data ]) => {
      assistant.ask(`${name}'s ${ability} is ${data.name}: ${data.description}`);
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
      assistant.ask(`${name}'s ${ability} cooldown is ${_cooldownToString(data.cooldown)}.`);
    });
}

function championAbilityDamage(assistant) {
  let champion = assistant.getArgument('champion');
  let ability = assistant.getArgument('ability');

  if ('passive' === ability)
    return; //TODO

  let champName = champs.then(data => data[champion].name);
  let champData = _getChampionAbility(champion, ability);

  return Promise.all([ champName, champData ])
    .then(([ name, data ]) => {
    console.log(data.name);
      let spell = new ChampionSpell(data);
      assistant.ask(`${name}'s ${ability} deals ${spell.getDamageString()}.`);
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
      if ('no cost' === costType || !costType)
        assistant.ask(`${name}'s ${ability} has no cost.`);
      else if (data.costType === data.resource) // '1 seed', null, etc.
        assistant.ask(`${name}'s ${ability} costs ${data.costType}.`);
      else {
        let costArr = data.cost;
        let costStr = formatValues(costArr, costType);
        assistant.ask(`${name}'s ${ability} costs ${costStr}.`);
      }
    });
}

module.exports = {
  championAbility,
  championAbilityCooldown,
  championAttackRange,
  championCount,
  championAbilityDamage,
  championAbilityCost,
};
