/*
<span class=\"colorFF9900\">Passive:</span>
Crystallizing enemies with Fracture and Impale grants
<span class=\"colorFFF673\">Crystal Charge</span>
for the disable duration and reduces the cooldown of Fracture by the same amount.
<br />
<br />
<span class=\"colorFF9900\">Active:</span>
Skarner summons a blast of crystalline energy, dealing {{ e1 }}
<span class=\"color99FF99\">(+{{ a1 }})</span> magic damage,
slowing targets hit by {{ e8 }}% for {{ e7 }} seconds and reducing the blast's speed.
<br />
<br />
Enemies hit by Fracture are afflicted with Crystal Venom for {{ e6 }} seconds,
causing Skarner's next basic attack against them to deal {{ e2 }} additional physical damage
and stun the target for {{ e3 }} second.
*/

const formatValues = require('./formatValues');

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, '');
}

const linkMap = {
  bonusattackdamage: 'Bonus AD',
  attackdamage: 'AD',
  spelldamage: 'AP'
};
function linkToString(link) {
  return linkMap[link];
}
function varToString(val) {
  return `${(100 * val.coeff).toFixed(0)}% ${linkToString(val.link)}`;
}

function ChampionSpell(spell) {
  this._initDamageString(spell);
}

// ChampionSpell.prototype.tooltipAtLevel = function(level) {
//   let tooltip = spell.tooltip;
//   for (let i = 1; i < spell.effect.length; i++) {
//     let statArr = spell.effect[i];
//     let value = statArr[level];
//     tooltip = tooltip.replace(RegExp(`\\{\\{\\s+e${i}\\s+\\}\\}`, 'g'), value);
//   }
//   return tooltip;
// };

ChampionSpell.prototype._getVar = function(spell, key) {
  return spell.vars.find(v => v.key === key);
};

ChampionSpell.prototype._initDamageString = function(spell) {
  let tooltipPlain = stripHtml(spell.tooltip);
  // https://regex101.com/r/jrF0hK/3
  let regex = /(?:take|deal(?:ing|s)?) {{ (\S\d) }}( \(\+{{ (\S\d) }}\))?(?: additional| bonus)? (magic|physical) damage/gi;
  let match;
  let dmgs = [];
  while ((match = regex.exec(tooltipPlain))) {
    let [ , mainKey, , growthKey, type ] = match;
    let main, growth;
    if (mainKey.charAt(0) === 'e')
      main = spell.effect[mainKey.slice(1)];
    else
      main = this._getVar(spell, mainKey);
    if (!main) // Zyra Q, E. Plants are in desc. Probably other places.
      continue;
    growth = !!growthKey && this._getVar(spell, growthKey);
    // `affect` has propery 'link', which is 'spelldamage', 'attackdamage', or 'bonusattackdamage' (?).
    dmgs.push({ main, growth, type });
  }

  if (!dmgs.length) {
    this.damageString = 'no damage';
    return;
  }
  this.damageString = dmgs
    .map(dmg => {
      let s;
      if (dmg.main instanceof Array) {
        s = formatValues(dmg.main, dmg.type + ' damage');
        if (dmg.growth)
          s += `, plus ${varToString(dmg.growth)}`;
      }
      else {
        s = varToString(dmg.main);
        if (dmg.growth)
          s += ` plus ${varToString(dmg.growth)}`;
        s +=  ` as ${dmg.type} damage`;
      }

      return s;
    })
    .join('; and ');
};
ChampionSpell.prototype.getDamageString = function() {
  return this.damageString;
};
ChampionSpell.stripHtml = stripHtml;



module.exports = ChampionSpell;
