
/* Classify champion role by champion
 * @param {Int} championID
 * @returns {String}
 */
getChampionRole = function(championID) {
	if (championID == 1 ||
		championID == 2 || 
		championID == 3 ) {
		return "AD"
	}
	else if (championID == 4) {
		return "TANK"
	}
	else if (championID == 5) {
		return "UTIL"
	}
	else {
		return "AP"
	}
}

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
					"Last Whisper"
				],
				"Poke" : [
					"Bloodthirster"
				],
				"Burst" : [
					"Hexdrinker",
					"Death's Dance"
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
			}
		},
		"TANK" : {
			"Winning" : {
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
			}
		},
		"UTIL" : {
			"Winning" : {
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
			}
		}
	}

	console.log(itemClassification[role][status][itemFunction].toString())
	return itemClassification[role][status][itemFunction].toString()
}

getItemClassification("AD", "Winning", "Damage")