module.exports = function(context) {
  const rp = require('request-promise-native');

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

  const _defaultLocales = {
    en: 'en_US',
    jp: 'jp_JA'
  }
  function _convertLang(lang) {
    if (!lang)
      return 'en_US';
    if (2 === lang.length) {
      return _defaultLocales[lang];
    }
    return lang.replace('-', '_');
  }

  const _champs = {};
  function _getAllChamps(locale="en_US") {
    return _champs[locale] = _champs[locale] || (latest
      .then(version => rp(`${CDN}${version}/data/${locale}/champion.json`))
      .then(JSON.parse)
      .then(json => json.data));
  }

  const abilitiesIndicies = [ 'Q', 'W', 'E', 'R' ];

  function _getChampion(championKey, locale="en_US") {
    return latest
      .then(version => req(`${CDN}${version}/data/${locale}/champion/${championKey}.json`))
      .then(JSON.parse)
      .then(json => json.data[championKey]);
  }
  function _getChampionAbility(championKey, ability, locale) {
    if ('passive' === ability) {
      return _getChampion(championKey, locale)
        .then(champ => champ.passive);
    }
    else {
      return _getChampion(championKey, locale)
        .then(champ => champ.spells)
        .then(abilities => abilities[abilitiesIndicies.indexOf(ability)]);
    }
  }

  function _cooldownToString(arr) {
    return formatValues(arr, 'seconds');
  }

  context.register('champion').asFunction({
    deps: [ 'assistant' ],
    func({ assistant }) {
      let champion = assistant.getArgument('champion');
      if (!champion) {
        assistant.ask("I'm sorry, I don't know what champion that is.");
        throw false;
      }
      return champion;
    }
  });
  context.register('ability').asFunction({
    deps: [ 'assistant' ],
    func({ assistant }) {
      let ability = assistant.getArgument('ability');
      if (!ability) {
        assistant.ask("I'm sorry, I don't know what ability that is.");
        throw false;
      }
      return ability;
    }
  });

  context.register('$Static.ChampionCount').asFunction({
    deps: [ 'assistant' ],
    func({ assistant }) {
      return _getAllChamps(_convertLang(assistant.getUserLocale())).then(data =>
        assistant.ask(`There are ${Object.keys(data).length} champions.`));
    }
  });

  context.register('$Static.ChampionAttackRange').asFunction({
    deps: [ 'assistant', 'champion' ],
    func({ assistant, champion }) {
      return _getAllChamps(_convertLang(assistant.getUserLocale())).then(data => {
        let champ = data[champion];
        assistant.ask(`${champ.name}'s auto attack range is ${champ.stats.attackrange} units.`);
      });
    }
  });

  context.register('$Static.ChampionAbility').asFunction({
    deps: [ 'assistant', 'champion', 'ability' ],
    func({ assistant, champion, ability }) {
      let champName = _getAllChamps(_convertLang(assistant.getUserLocale())).then(data => data[champion].name);
      let champData = _getChampionAbility(champion, ability, _convertLang(assistant.getUserLocale()));

      return Promise.all([ champName, champData ])
        .then(([ name, data ]) => {
          assistant.ask(`${name}'s ${ability} is ${data.name}: ${ChampionSpell.stripHtml(data.description)}`);
        });
    }
  });

  context.register('$Static.ChampionAbilityCooldown').asFunction({
    deps: [ 'assistant', 'champion', 'ability' ],
    func({ assistant, champion, ability }) {
      if ('passive' === ability)
        return assistant.ask("No cooldown."); //TODO

      let champName = _getAllChamps(_convertLang(assistant.getUserLocale())).then(data => data[champion].name);
      let champData = _getChampionAbility(champion, ability, _convertLang(assistant.getUserLocale()));

      return Promise.all([ champName, champData ])
        .then(([ name, data ]) => {
          assistant.ask(`${name}'s ${ability} cooldown is ${_cooldownToString(data.cooldown)}.`);
        });
    }
  });

  context.register('$Static.ChampionAbilityDamage').asFunction({
    deps: [ 'assistant', 'champion', 'ability' ],
    func({ assistant, champion, ability }) {
      if ('passive' === ability)
        return assistant.ask("Passive damage currently not supported, sorry."); //TODO

      let champName = _getAllChamps(_convertLang(assistant.getUserLocale())).then(data => data[champion].name);
      let champData = _getChampionAbility(champion, ability, _convertLang(assistant.getUserLocale()));

      return Promise.all([ champName, champData ])
        .then(([ name, data ]) => {
        console.log(data.name);
          let spell = new ChampionSpell(data);
          assistant.ask(`${name}'s ${ability} deals ${spell.getDamageString()}.`);
        });
    }
  });

  context.register('$Static.ChampionAbilityCost').asFunction({
    deps: [ 'assistant', 'champion', 'ability' ],
    func({ assistant, champion, ability }) {
      if ('passive' === ability)
        return assistant.ask("No cost."); //TODO

      let champName = _getAllChamps(_convertLang(assistant.getUserLocale())).then(data => data[champion].name);
      let champData = _getChampionAbility(champion, ability, _convertLang(assistant.getUserLocale()));

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
  });
}
