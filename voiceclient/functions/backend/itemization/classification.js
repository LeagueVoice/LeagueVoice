
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
 * @param {String} itemType - classification for item function 
 * @returns {String}
 */
getItemClassification = function(itemType) {
	const itemClassification = {
		"AD" : {
			"Damage" : {
				"asdfasdf",
			}, 
			"Poke" : {
				"asdf",
			},
			"Burst" : {
				"asdf",
			}, 
			"CC" : {
				"asdfadsf",
			}
		},
		"AP" : {
			"Damage" : {
				"asdfasdf",
			}, 
			"Poke" : {
				"asdf",
			},
			"Burst" : {
				"asdf",
			}, 
			"CC" : {
				"asdfadsf",
			}
		},
		"TANK" : {
			"Damage" : {
				"asdfasdf",
			}, 
			"Poke" : {
				"asdf",
			},
			"Burst" : {
				"asdf",
			}, 
			"CC" : {
				"asdfadsf",
			}
		},
		"UTIL" : {
			"Damage" : {
				"asdfasdf",
			}, 
			"Poke" : {
				"asdf",
			},
			"Burst" : {
				"asdf",
			}, 
			"CC" : {
				"asdfadsf",
			}
		},
	}
}