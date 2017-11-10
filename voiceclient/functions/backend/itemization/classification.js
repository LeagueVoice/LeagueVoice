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
					"Last Whisper",
					"Phantom Dancer"
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
					"asdfasdf"
				], 
				"Poke" : [
					"asdf"
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance"
				], 
				"CC" : [
					"asdfadsf"
				]
			},
			"Losing" : {
				"Damage" : [
					"Infinity Edge",
					"Statikk Shiv"
				], 
				"Poke" : [
					"Bloodthirster"
				],
				"Burst" : [
					"asdf"
				], 
				"CC" : [
					"asdfadsf"
				]
			}
		},
		"AP" : {
			"Winning" : {
				"Damage" : [
					"Rabadon's Deathcap"
				], 
				"Poke" : [
					"asdfasdf"
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
					"Void Staff"
				], 
				"Poke" : [
					"Morellonomicon",
					"Archangel's Staff"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter"
				], 
				"CC" : [
					"asdfasdf"
				], 
			},
			"Losing" : {
				"Damage" : [
					"Rylai's Crystal Scepter"
				], 
				"Poke" : [
					"asdfasdf"
				], 
				"Burst" : [
					"Banshee's Veil",
					"Rylai's Crystal Scepter"
				], 
				"CC" : [
					"asdfasdf"
				], 
			}
		},
		"TANK" : {
			"Winning" : {
				"Damage" : [
					"Infinity Edge",
					"Statikk Shiv"
				], 
				"Poke" : [
					"Randuin's Omen",
					"Warmog's Armor",
					"Righteous Glory"
				], 
				"Burst" : [
					"Hextech Protobelt-01",
					"Death's Dance",
					"Guardian Angel"
				], 
				"CC" : [
					"Quicksilver Sash",
					"Mercurial Scimitar"
				], 
			}, 
			"Same" : {
				"Damage" : [
					"asdfasdf"
				], 
				"Poke" : [
					"asdfasdf"
				], 
				"Burst" : [
					"asdfasdf"
				], 
				"CC" : [
					"asdfasdf"
				], 
			},
			"Losing" : {
				"Damage" : [
					"Last Whisper"
				], 
				"Poke" : [
					"Righteous Glory",
					"Spirit Visage"
				], 
				"Burst" : [
					"Hexdrinker",
					"Death's Dance"
				], 
				"CC" : [
					"asdfasdf"
				], 
			}
		},
		"UTIL" : {fdsa
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
					"asdfasdf"
				], 
				"Poke" : [
					"Redemption"
				], 
				"Burst" : [
					"asdf"
				], 
				"CC" : [
					"asdfasdf"
				], 
			},
			"Losing" : {
				"Damage" : [
					"asdfasdf"
				], 
				"Poke" : [
					"Redemption"
				], 
				"Burst" : [
					"Locket of the Iron Solari"
				], 
				"CC" : [
					"asdfasdf"
				], 
			}
		}
	}

	console.log(itemClassification[role][status][itemFunction].toString())
	return itemClassification[role][status][itemFunction].toString()
}

getItemClassification("AD", "Winning", "Damage")

module.exports = {
	getItemClassification,
	getChampionRole
}