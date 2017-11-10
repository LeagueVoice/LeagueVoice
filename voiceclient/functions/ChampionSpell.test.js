const { expect } = require('chai');

const ChampionSpell = require('./ChampionSpell');
const skarnerAbilities = getSkarnerAbilities();

describe('ChampionSpell', function() {

//   it('test skarner e', function() {
//     let skarnerE = new ChampionSpell(
// {"id":"SkarnerFracture","name":"Fracture","description":"Skarner summons a blast of crystalline energy which deals damage to enemies struck and slows them. Basic attacking these enemies within a short window will stun them.","tooltip":"<span class=\"colorFF9900\">Passive:</span> Crystallizing enemies with Fracture and Impale grants <span class=\"colorFFF673\">Crystal Charge</span> for the disable duration and reduces the cooldown of Fracture by the same amount.<br /><br /><span class=\"colorFF9900\">Active:</span> Skarner summons a blast of crystalline energy, dealing {{ e1 }} <span class=\"color99FF99\">(+{{ a1 }})</span> magic damage, slowing targets hit by {{ e8 }}% for {{ e7 }} seconds and reducing the blast's speed.<br /><br />Enemies hit by Fracture are afflicted with Crystal Venom for {{ e6 }} seconds, causing Skarner's next basic attack against them to deal {{ e2 }} additional physical damage and stun the target for {{ e3 }} second.","leveltip":{"label":["Blast Damage / Attack Damage","Slow","Cooldown"],"effect":["{{ e1 }} / {{ e2 }} -> {{ e1NL }} / {{ e2NL }}","{{ e8 }}% -> {{ e8NL }}%","{{ cooldown }} -> {{ cooldownNL }}"]},"maxrank":5,"cooldown":[14,13.5,13,12.5,12],"cooldownBurn":"14/13.5/13/12.5/12","cost":[55,55,55,55,55],"costBurn":"55","effect":[null,[40,65,90,115,140],[25,35,45,55,65],[1,1,1,1,1],[50,50,50,50,50],[6,6,6,6,6],[5,5,5,5,5],[2.5,2.5,2.5,2.5,2.5],[30,35,40,45,50],[0,0,0,0,0],[0,0,0,0,0]],"effectBurn":[null,"40/65/90/115/140","25/35/45/55/65","1","50","6","5","2.5","30/35/40/45/50","0","0"],"vars":[{"link":"spelldamage","coeff":0.2,"key":"a1"}],"costType":" Mana","maxammo":"-1","range":[980,980,980,980,980],"rangeBurn":"980","image":{"full":"SkarnerFracture.png","sprite":"spell10.png","group":"spell","x":144,"y":96,"w":48,"h":48},"resource":"{{ cost }} Mana"}
//     );
//     let expected = '<span class="colorFF9900">Passive:</span> Crystallizing enemies with Fracture and Impale grants <span class="colorFFF673">Crystal Charge</span> for the disable duration and reduces the cooldown of Fracture by the same amount.<br /><br /><span class="colorFF9900">Active:</span> Skarner summons a blast of crystalline energy, dealing 115 <span class="color99FF99">(+{{ a1 }})</span> magic damage, slowing targets hit by 45% for 2.5 seconds and reducing the blast\'s speed.<br /><br />Enemies hit by Fracture are afflicted with Crystal Venom for 5 seconds, causing Skarner\'s next basic attack against them to deal 55 additional physical damage and stun the target for 1 second.';
//     skarnerE._getDamage();
//     expect(skarnerE.tooltipAtLevel(3)).to.equal(expected);
//   });

  it('test skarner all', function() {
    for (let ability of skarnerAbilities) {
      console.log(ability.getDamageString());
    }
  });

});






function getSkarnerAbilities() {
  return [{
		"id": "SkarnerVirulentSlash",
		"name": "Crystal Slash",
		"description": "Skarner lashes out with his claws, dealing physical damage to all nearby enemies and charging himself with Crystal Energy for several seconds if a unit is struck. If he casts Crystal Slash again while powered by Crystal Energy, he deals bonus magic damage.",
		"tooltip": "Skarner deals <span class=\"colorFF8C00\">{{ f1 }}</span> physical damage to all nearby enemies. If a unit is struck, he charges himself with Crystal Energy for {{ e2 }} seconds.<br /><br />While Skarner is charged, Crystal Slash deals <span class=\"colorFF8C00\">{{ f1 }}</span> <span class=\"color99FF99\">(+{{ a1 }})</span> bonus magic damage.<br /><br />Basic attacks against non-structures lower Crystal Slash's cooldown by 0.25 seconds (quadrupled against champions).",
		"leveltip": {
			"label": ["Total Attack Damage Ratio", "Cooldown", "Mana Cost"],
			"effect": ["{{ e1 }}% -> {{ e1NL }}%", "{{ cooldown }} -> {{ cooldownNL }}", "{{ cost }} -> {{ costNL }}"]
		},
		"maxrank": 5,
		"cooldown": [3.5, 3.25, 3, 2.75, 2.5],
		"cooldownBurn": "3.5/3.25/3/2.75/2.5",
		"cost": [10, 11, 12, 13, 14],
		"costBurn": "10/11/12/13/14",
		"effect": [null, [33, 36, 39, 42, 45],
			[4, 4, 4, 4, 4],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		],
		"effectBurn": [null, "33/36/39/42/45", "4", "0", "0", "0", "0", "0", "0", "0", "0"],
		"vars": [{
			"link": "bonusattackdamage",
			"coeff": 0.8,
			"key": "f1"
		}, {
			"link": "bonusattackdamage",
			"coeff": 0.8,
			"key": "f1"
		}, {
			"link": "spelldamage",
			"coeff": 0.3,
			"key": "a1"
		}],
		"costType": " Mana",
		"maxammo": "-1",
		"range": [350, 350, 350, 350, 350],
		"rangeBurn": "350",
		"image": {
			"full": "SkarnerVirulentSlash.png",
			"sprite": "spell10.png",
			"group": "spell",
			"x": 48,
			"y": 96,
			"w": 48,
			"h": 48
		},
		"resource": "{{ cost }} Mana"
	}, {
		"id": "SkarnerExoskeleton",
		"name": "Crystalline Exoskeleton",
		"description": "Skarner gains a shield and has increased Movement Speed while the shield persists.",
		"tooltip": "Skarner is shielded for <span class=\"colorCC3300\">{{ f1 }}</span> ({{ e1 }}% of his maximum health) <span class=\"color99FF99\">(+{{ a1 }})</span> damage for {{ e4 }} seconds. While the shield persists, Skarner gains movement speed that ramps up to {{ e5 }}% over 3 seconds.",
		"leveltip": {
			"label": ["Max Health Damage Absorption", "Movement Speed Bonus", "Cooldown"],
			"effect": ["{{ e1 }}% -> {{ e1NL }}%", "{{ e5 }}% -> {{ e5NL }}%", "{{ cooldown }} -> {{ cooldownNL }}"]
		},
		"maxrank": 5,
		"cooldown": [13, 12.5, 12, 11.5, 11],
		"cooldownBurn": "13/12.5/12/11.5/11",
		"cost": [60, 60, 60, 60, 60],
		"costBurn": "60",
		"effect": [null, [10, 11, 12, 13, 14],
			[30, 35, 40, 45, 50],
			[8, 10, 12, 14, 16],
			[6, 6, 6, 6, 6],
			[16, 20, 24, 28, 32],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		],
		"effectBurn": [null, "10/11/12/13/14", "30/35/40/45/50", "8/10/12/14/16", "6", "16/20/24/28/32", "0", "0", "0", "0", "0"],
		"vars": [{
			"link": "spelldamage",
			"coeff": 0.8,
			"key": "a1"
		}],
		"costType": " Mana",
		"maxammo": "-1",
		"range": [1, 1, 1, 1, 1],
		"rangeBurn": "1",
		"image": {
			"full": "SkarnerExoskeleton.png",
			"sprite": "spell10.png",
			"group": "spell",
			"x": 96,
			"y": 96,
			"w": 48,
			"h": 48
		},
		"resource": "{{ cost }} Mana"
	}, {
		"id": "SkarnerFracture",
		"name": "Fracture",
		"description": "Skarner summons a blast of crystalline energy which deals damage to enemies struck and slows them. Basic attacking these enemies within a short window will stun them.",
		"tooltip": "<span class=\"colorFF9900\">Passive:</span> Crystallizing enemies with Fracture and Impale grants <span class=\"colorFFF673\">Crystal Charge</span> for the disable duration and reduces the cooldown of Fracture by the same amount.<br /><br /><span class=\"colorFF9900\">Active:</span> Skarner summons a blast of crystalline energy, dealing {{ e1 }} <span class=\"color99FF99\">(+{{ a1 }})</span> magic damage, slowing targets hit by {{ e8 }}% for {{ e7 }} seconds and reducing the blast's speed.<br /><br />Enemies hit by Fracture are afflicted with Crystal Venom for {{ e6 }} seconds, causing Skarner's next basic attack against them to deal {{ e2 }} additional physical damage and stun the target for {{ e3 }} second.",
		"leveltip": {
			"label": ["Blast Damage / Attack Damage", "Slow", "Cooldown"],
			"effect": ["{{ e1 }} / {{ e2 }} -> {{ e1NL }} / {{ e2NL }}", "{{ e8 }}% -> {{ e8NL }}%", "{{ cooldown }} -> {{ cooldownNL }}"]
		},
		"maxrank": 5,
		"cooldown": [14, 13.5, 13, 12.5, 12],
		"cooldownBurn": "14/13.5/13/12.5/12",
		"cost": [55, 55, 55, 55, 55],
		"costBurn": "55",
		"effect": [null, [40, 65, 90, 115, 140],
			[25, 35, 45, 55, 65],
			[1, 1, 1, 1, 1],
			[50, 50, 50, 50, 50],
			[6, 6, 6, 6, 6],
			[5, 5, 5, 5, 5],
			[2.5, 2.5, 2.5, 2.5, 2.5],
			[30, 35, 40, 45, 50],
			[0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0]
		],
		"effectBurn": [null, "40/65/90/115/140", "25/35/45/55/65", "1", "50", "6", "5", "2.5", "30/35/40/45/50", "0", "0"],
		"vars": [{
			"link": "spelldamage",
			"coeff": 0.2,
			"key": "a1"
		}],
		"costType": " Mana",
		"maxammo": "-1",
		"range": [980, 980, 980, 980, 980],
		"rangeBurn": "980",
		"image": {
			"full": "SkarnerFracture.png",
			"sprite": "spell10.png",
			"group": "spell",
			"x": 144,
			"y": 96,
			"w": 48,
			"h": 48
		},
		"resource": "{{ cost }} Mana"
	}, {
		"id": "SkarnerImpale",
		"name": "Impale",
		"description": "Skarner suppresses an enemy champion and deals damage to it. During this time, Skarner can move freely and will drag his helpless victim around with him. When the effect ends, the target will be dealt additional damage.",
		"tooltip": "Skarner suppresses an enemy champion for {{ e1 }} seconds, dealing <span class=\"colorFF8C00\">{{ a2 }}</span> physical damage plus {{ e2 }} <span class=\"color99FF99\">(+{{ a1 }})</span> magic damage. Skarner can move freely during this time, and will drag his helpless victim around with him. When the effect ends, Skarner's target will be dealt the same damage again.",
		"leveltip": {
			"label": ["Damage", "Cooldown"],
			"effect": ["{{ e2 }} -> {{ e2NL }}", "{{ cooldown }} -> {{ cooldownNL }}"]
		},
		"maxrank": 3,
		"cooldown": [120, 100, 80],
		"cooldownBurn": "120/100/80",
		"cost": [100, 100, 100],
		"costBurn": "100",
		"effect": [null, [1.75, 1.75, 1.75],
			[20, 60, 100],
			[50, 75, 100],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		],
		"effectBurn": [null, "1.75", "20/60/100", "50/75/100", "0", "0", "0", "0", "0", "0", "0"],
		"vars": [{
			"link": "attackdamage",
			"coeff": 0.6,
			"key": "a2"
		}, {
			"link": "spelldamage",
			"coeff": 0.5,
			"key": "a1"
		}],
		"costType": " Mana",
		"maxammo": "-1",
		"range": [350, 350, 350],
		"rangeBurn": "350",
		"image": {
			"full": "SkarnerImpale.png",
			"sprite": "spell10.png",
			"group": "spell",
			"x": 192,
			"y": 96,
			"w": 48,
			"h": 48
		},
		"resource": "{{ cost }} Mana"
	}]
  .map(ability => new ChampionSpell(ability));
}
