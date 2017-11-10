
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
			"Early" : {
				"BF Sword",
			}, 
			"Mid" : {
				"Giant Slayer",
			},
			"Late" : {
				"Infinity Edge",
			},
		},
		"AP" : {
			"Early" : {
				"fsdf",
			}, 
			"Mid" : {
				"asdf",
			},
			"Late" : {
				"asdf",
			},
		},
		"TANK" : {
			"Early" : {
				"asdf",
			}, 
			"Mid" : {
				"asdf",
			},
			"Late" : {
				"asdf",
			},
		},
		"UTIL" : {
			"Early" : {
				"asdf",
			}, 
			"Mid" : {
				"asdf",
			},
			"Late" : {
				"asdf",
			},
		},
	}
}