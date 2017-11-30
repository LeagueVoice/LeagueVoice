module.exports = function(context) {
  const rp = require('request-promise-native');

  const formatValues = require('./formatValues');
  const ChampionSpell = require('./ChampionSpell');

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

  context.register('ddragonVersion').asFunction({
    cached: true,
    deps: [ 'get' ],
    func({ get }) {
      return get('https://ddragon.leagueoflegends.com/api/versions.json')
        .then(JSON.parse)
        .then(versions => versions[0]);
    }
  });

  context.register('ddragonLocale').asFunction({
    deps: [ 'locale' ],
    func({ locale, defaultLocales }) {
      if (2 === locale.length)
        return defaultLocales[locale];
      return locale.replace('-', '_');
    },
    params: {
      defaultLocales: {
        en: 'en_US',
        jp: 'jp_JA'
      }
    }
  });

  context.register('allChampionData').asFunction({
    deps: [ 'get', 'ddragonLocale', 'ddragonVersion' ],
    func({ get, ddragonLocale, ddragonVersion: version, localeCache }) {
      return localeCache[ddragonLocale] = localeCache[ddragonLocale] ||
        get(`${CDN}${version}/data/${ddragonLocale}/champion.json`)
          .then(JSON.parse).then(json => json.data);
    },
    params: {
      localeCache: {}
    }
  });
  context.register('championBasicData').asFunction({
    deps: [ 'allChampionData', 'champion' ],
    func({ allChampionData, champion }) {
      return allChampionData[champion];
    }
  });
  context.register('championName').asFunction({
    deps: [ 'championBasicData' ],
    func({ championBasicData }) {
      return championBasicData.name;
    }
  });

  const CDN = 'http://ddragon.leagueoflegends.com/cdn/';
  context.register('championData').asFunction({
    deps: [ 'get', 'ddragonLocale', 'ddragonVersion', 'champion' ],
    func({ get, ddragonLocale: locale, ddragonVersion: version, champion }) {
      return get(`${CDN}${version}/data/${locale}/champion/${champion}.json`)
        .then(JSON.parse).then(json => json.data[champion]);
    }
  });
  context.register('abilityData').asFunction({
    deps: [ 'championData', 'ability' ],
    func({ championData, ability, abilitiesIndicies }) {
      if ('passive' === ability)
        return championData.passive;
      return championData.spells[abilitiesIndicies.indexOf(ability)];
    },
    params: {
      abilitiesIndicies: [ 'Q', 'W', 'E', 'R' ]
    }
  });

  function _cooldownToString(arr) {
    return formatValues(arr, 'seconds');
  }

  context.register('$Static.ChampionCount').asFunction({
    deps: [ 'assistant', 'allChampionData' ],
    func({ assistant, allChampionData }) {
      return assistant.ask(`There are ${Object.keys(allChampionData).length} champions.`);
    }
  });
  context.register('$Static.ChampionAttackRange').asFunction({
    deps: [ 'assistant', 'championBasicData' ],
    func({ assistant, championBasicData: data }) {
      assistant.ask(`${data.name}'s auto attack range is ${data.stats.attackrange} units.`);
    }
  });
  context.register('$Static.ChampionAbility').asFunction({
    deps: [ 'assistant', 'championName', 'ability', 'abilityData' ],
    func({ assistant, championName, ability, abilityData }) {
      assistant.ask(
        `${championName}'s ${ability} is ${abilityData.name}: ${ChampionSpell.stripHtml(abilityData.description)}`);
    }
  });
  context.register('$Static.ChampionAbilityCooldown').asFunction({
    deps: [ 'assistant', 'championName', 'ability', 'abilityData' ],
    func({ assistant, championName, ability, abilityData }) {
      assistant.ask(
        `${championName}'s ${ability} cooldown is ${_cooldownToString(abilityData.cooldown)}.`);
    }
  });
  context.register('$Static.ChampionAbilityDamage').asFunction({
    deps: [ 'assistant', 'championName', 'ability', 'abilityData' ],
    func({ assistant, championName, ability, abilityData }) {
      let spell = new ChampionSpell(abilityData);
      assistant.ask(
        `${championName}'s ${ability} deals ${spell.getDamageString()}.`);
    }
  });
  context.register('$Static.ChampionAbilityCost').asFunction({
    deps: [ 'assistant', 'championName', 'ability', 'abilityData' ],
    func({ assistant, championName: name, ability, abilityData: data }) {
      if ('passive' === ability)
        return assistant.ask("No cost."); //TODO

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
    }
  });
}
