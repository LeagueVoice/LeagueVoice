const rp = require('request-promise');
const cheerio = require('cheerio');

const getTipsAgainst = function(enemyChamp, myChamp = "") {
	const options = {
		uri: `http://lolcounter.com/tips/` + enemyChamp + `/` + myChamp,
		transform: function (body) {
			return cheerio.load(body);
		}
	}
	console.log(options.uri)
	var tips = []

	rp(options).then(function($){
		console.log('loaded')
		$('.tips').children().each(function(i, elem) {
			if ($(this).find('.votes').text() > 200){
				tips[i] = $(this).children('.tip').children('._tip').text()
				console.log(tips[i])
			}
		})
		if (myChamp !== "" && tips.length === 0){
			const options = {
				uri: `http://lolcounter.com/tips/` + enemyChamp,
				transform: function (body) {
					return cheerio.load(body);
				}
			}
			rp(options).then(function($){
				$('.tips').children().each(function(i, elem) {
					if ($(this).find('.votes').text() > 200){
						tips[i] = $(this).children('.tip').children('._tip').text()
						console.log(tips[i])
					}
				})
				return tips			
			})
		}
		return tips
		
	})
	.catch(function(e){
		console.log(e)
	});
}

module.exports = {
	getTipsAgainst
}

