const classification = require('./backend/itemization/classification')

const ItemWinLoseEqual = (app) => {
	console.log(classification.getItemClassification('AD', 'Winning', 'Damage'))
}

module.exports = {
	ItemWinLoseEqual
}
