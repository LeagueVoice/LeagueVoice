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
					"Duskblade of Draktharr"
				],
				"Poke" : [
					"Bloodthirster",
					"Blade of the Ruined King"
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Guardian Angel"
				],
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar"
				]
			},
			"Same" : {
				"Damage" : [
					"Infinity Edge",
					"Rapid Fire Cannon",
					"Black Cleaver",
					"Ghostblade"
				], 
				"Poke" : [
					"Bloodthirster"
					"Maw of Malmortius"
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Sterak's Gage",
					"Guardian's Angel"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar"
				]
			},
			"Losing" : {
				"Damage" : [
					"Statikk Shiv",
					"Last Whisper"
				], 
				"Poke" : [
					"Bloodthirster"
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance",
					"Sterak's Gage"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar"
				]
			}
		},
		"AP" : {
			"Winning" : {
				"Damage" : [
					"Rabadon's Deathcap",
					"Mejai's Soulstealer"
				], 
				"Poke" : [
					"Zhonya's Hourglass",
					"Banshee's Veil"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Hextech Protobelt-01",
					"Zhonya's Hourglass",
					"Rod of Ages"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil"
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Void Staff",
					"Morellonomicon"
				], 
				"Poke" : [
					"Morellonomicon",
					"Archangel's Staff"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter",
					"Rod of Ages"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil"
				], 
			},
			"Losing" : {
				"Damage" : [
					"Void Staff"
				], 
				"Poke" : [
					"Banshee's Veil"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Banshee's Veil"
				]
			}
		},
		"TANK" : {
			"Winning" : {
				"Damage" : [
					"Sterak's Gage",
					"Ravenous Hydra",
					"Dead Man's Plate",
					"Frozen Mallet"
				], 
				"Poke" : [
					"Randuin's Omen",
					"Warmog's Armor",
					"Righteous Glory",
					"Spirit Visage"
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Guardian Angel",
				], 
				"CC" : [
					"Mercurial Scimitar"
					"Gargoyle's Stoneplate"
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Sterak's Gage",
					"Dead Man's Plate"
				], 
				"Poke" : [
					"Warmog's Armor",
					"Randuin's Omen",
					"Spirit Visage"
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Guardian Angel",
					"Abyssal Mask"
				], 
				"CC" : [
					"Gargoyle's Stoneplate"
				], 
			},
			"Losing" : {
				"Damage" : [
					"Thornmail",
				], 
				"Poke" : [
					"Righteous Glory",
					"Spirit Visage"
				], 
				"Burst" : [
					"Thornmail",
					"Gargoyle's Stoneplate",
					"Guardian Angel"
				], 
				"CC" : [
					"Gargoyle's Stoneplate"
				]
			}
		},
		"UTIL" : {
			"Winning" : {
				"Damage" : [
					"Control Ward"
				], 
				"Poke" : [
					"Redemption"
				], 
				"Burst" : [
					"Locket of the Iron Solari",
					"Banshee's Veil"
				], 
				"CC" : [
					"Mikael's Crucible"
				], 
			}, 
			"Same" : {
				"Damage" : [
					"Control Ward"
				], 
				"Poke" : [
					"Redemption",
					"Ardent Censor"
				], 
				"Burst" : [
					"Locket of the Iron Solari"
				], 
				"CC" : [
					"Mikael's Crucible"
				], 
			},
			"Losing" : {
				"Damage" : [
					"Control Ward"
				], 
				"Poke" : [
					"Redemption"
				], 
				"Burst" : [
					"Locket of the Iron Solari"
				], 
				"CC" : [
					"Mikael's Crucible"
				]
			}
		}
	}

	return itemClassification[role][status][itemFunction]
}

getItemClassification("AD", "Winning", "Damage")

module.exports = {
	getItemClassification,
}