const championRole = require('./championRole.js');
const firebase = require('firebase-admin');

/* Get items for situation
 * @param {String} role - ad, ap, util, tank
 * @param {String} status - winning, losing, same 
 * @param {String} itemFunction - damage, poke, burst, cc
 * @returns {String}
 */
getItemClassification = function(role, status, itemFunction) {
	const itemClassification = {
		"AD" : {
			"Winning" : {
				"Damage" : [
					"Infinity Edge",
					"Statikk Shiv",
					"Phantom Dancer",
					"Duskblade of Draktharr",
					"These are high-damage items that will help you keep a lead."
				],
				"Poke" : [
					"Bloodthirster",
					"Blade of the Ruined King",
					"Lifesteal items will help you regain health between waves. Choose the lifesteal item that best fits your champion."
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Guardian Angel",
					"These defensive items will help keep you alive and dishing out damage if you're getting focused."
				],
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar",
					"These powerful active items will get you out of long disables like stuns and suppresses."
				]
			},
			"Same" : {
				"Damage" : [
					"Infinity Edge",
					"Rapid Fire Cannon",
					"Black Cleaver",
					"Ghostblade",
					"These are versatile damage items that will help you catch a lead."
				], 
				"Poke" : [
					"Bloodthirster",
					"Maw of Malmortius",
					"Lifesteal items will help you regain health between waves. Choose the lifesteal item that best fits your champion."
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Sterak's Gage",
					"Guardian's Angel",
					"These defensive items will help keep you alive and dishing out damage if you're getting focused."

				], 
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar",
					"These powerful active items will get you out of long disables like stuns and suppresses."
				]
			},
			"Losing" : {
				"Damage" : [
					"Statikk Shiv",
					"Last Whisper",
					"These will help your damage stay relevant with wave clear and tank busting."
				], 
				"Poke" : [
					"Bloodthirster",
					"Statikk Shiv",
					"Look to clear waves quickly and sustain yourself as you look for an opening to fight."
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Sterak's Gage",
					"Avoid Guardian Angel since the enemy team likely has the resources to kill you twice."
				], 
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar",
					"These powerful active items will get you out of long disables like stuns and suppresses."
				]
			}
		},
		"AP" : {
			"Winning" : {
				"Damage" : [
					"Rabadon's Deathcap",
					"If you're picking up lots of early kills, think about investing in Mejai's Soulstealer."
				], 
				"Poke" : [
					"Zhonya's Hourglass",
					"Banshee's Veil",
					"Buying resistances will mitigate how much damage you're taking. Keep dodging skillshots!"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Hextech Protobelt-01",
					"Zhonya's Hourglass",
					"Rod of Ages",
					"Increase your health pool and give yourself more options, like escapes and stasis effects."
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil",
					"Give yourself ways to block or escape enemy initiations."
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Void Staff",
					"Morellonomicon",
					"These are reliable choices that cover a wide-range of AP stats."
				], 
				"Poke" : [
					"Morellonomicon",
					"Archangel's Staff",
					"Keep your mana supply full to clear minion waves as you wait for an opening."
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter",
					"Rod of Ages",
					"Look to increase your health pool and buy resistances to counter what's bursting you down."
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil",
					"Give yourself ways to block or escape enemy initiations."
				], 
			},
			"Losing" : {
				"Damage" : [
					"Void Staff",
					"Ensure your damage stays relevant against decked-out tanks."
				], 
				"Poke" : [
					"Banshee's Veil",
					"Block high-damage siege spells that would take out a large chunk of health."
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter",
					"Look to increase your health pool and buy resistances to counter what's bursting you down."
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil",
					"Give yourself ways to block or escape enemy initiations."
				]
			}
		},
		"TANK" : {
			"Winning" : {
				"Damage" : [
					"Sterak's Gage",
					"Ravenous Hydra",
					"Dead Man's Plate",
					"Frozen Mallet",
					"Pose a threat to your enemies while your teammates clean up."
				], 
				"Poke" : [
					"Randuin's Omen",
					"Warmog's Armor",
					"Righteous Glory",
					"Spirit Visage",
					"Sustain through the damage, or give yourself ways to start fights when you see an opening."
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Shrug off or discourage burst damage on yourself. But you are the tank, so this could be good!"
				], 
				"CC" : [
					"Mercurial Scimitar",
					"Gargoyle's Stoneplate",
					"Usually, it's good that you're taking the CC instead of your teammates."
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Sterak's Gage",
					"Dead Man's Plate",
					"Pose a threat to your enemies while your teammates clean up."
				], 
				"Poke" : [
					"Warmog's Armor",
					"Randuin's Omen",
					"Spirit Visage",
					"Sustain through the damage, or give yourself ways to start fights when you see an opening."
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Guardian Angel",
					"Abyssal Mask",
					"Shrug off or discourage burst damage on yourself. You have to live long enough to remain a threat!"
				], 
				"CC" : [
					"Gargoyle's Stoneplate",
					"Usually, it's good that you're taking the CC instead of your teammates."
				], 
			},
			"Losing" : {
				"Damage" : [
					"Thornmail",
					"Enemies will be hitting you often- make the most of it!"
				], 
				"Poke" : [
					"Righteous Glory",
					"Spirit Visage",
					"Sustain through the damage, or give yourself ways to start fights when you see an opening."
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Guardian Angel",
					"Shrug off or discourage burst damage on yourself. You have to live long enough to remain a threat!"
				], 
				"CC" : [
					"Gargoyle's Stoneplate",
					"Usually, it's good that you're taking the CC instead of your teammates."
				]
			}
		},
		"UTIL" : {
			"Winning" : {
				"Damage" : [
					"Control Ward",
					"You don't need damage. More wards!"
				], 
				"Poke" : [
					"Redemption",
					"Once your team has taken a beating, drop a Redemption to heal them a substantial amount."
				], 
				"Burst" : [
					"Locket of the Iron Solari",
					"Banshee's Veil",
					"Decide whether you should invest in a personal shield or a team-wide shield."
				], 
				"CC" : [
					"Mikael's Crucible",
					"While Crucible cannot break yourself free from CC, keep this on hand for your teammates."
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Control Ward",
					"You don't need damage. More wards!"
				], 
				"Poke" : [
					"Redemption",
					"Ardent Censor",
					"Look for ways to augment healing for yourself and your team."
				], 
				"Burst" : [
					"Locket of the Iron Solari",
					"Knight's Vow",
					"Well used team defenses can win a teamfight and keep your teammates alive."
				], 
				"CC" : [
					"Mikael's Crucible",
					"While Crucible cannot break yourself free from CC, keep this on hand for your teammates."
				], 
			},
			"Losing" : {
				"Damage" : [
					"Control Ward",
					"You don't need damage. More wards!"
				], 
				"Poke" : [
					"Redemption",
					"Once your team has taken a beating, drop a Redemption to heal them for a substantial amount."
				], 
				"Burst" : [
					"Locket of the Iron Solari",
					"Well used team defenses can win a teamfight and keep your teammates alive."
				], 
				"CC" : [
					"Mikael's Crucible",
					"While Crucible cannot break yourself free from CC, keep this on hand for your teammates."
				]
			}
		}
	}
	console.log(role + " " + status + " " + itemFunction)
	return itemClassification[role][status][itemFunction]
}

getItems = function(uniqueID, status, situation) {
	return championRole.getCurrentChampionRole(uniqueID).then(function(role) {
		if (role.role == 'Tank') {
			return getItemClassification("TANK", status, situation);
		} else if (role.role == 'Support') {
			return getItemClassification("UTIL", status, situation);
		} else if (role.damageType == 'AD') {
			return getItemClassification('AD', status, situation);
		} else {
			return getItemClassification('AP', status, situation);
		}
	})
}

module.exports = {
	getItemClassification,
	getItems
}