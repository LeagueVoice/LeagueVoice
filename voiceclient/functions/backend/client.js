const rp = require('request-promise');

// Location of express service serving apiproxy.
var APIPROXY = 'http://104.196.43.62:3000';

// Returns a promise for getBySummonerName that resolves to the returned JSON
// from the Riot API.
getBySummonerName = function(name, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/summoner/getBySummonerName/' + name,
    json: true
  }
  return rp(options)
}

// Returns a promise for getRecentMatchList that resolves to the returned JSON
// from the Riot API matchlists/by-account/./recent endpoint.
getRecentMatchList = function(accountID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/match/getRecentMatchlist/' + accountID,
    json: true
  }
  return rp(options)
}

// Returns a promise for getMatch that resolves to the returned JSON from the
// Riot API matches/. endpoint.
getMatch = function(matchID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/match/getMatch/' + matchID,
    json: true
  }
  return rp(options)
}

getCurrentMatch = function(summonerID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/lol/spectator/v3/active-games/by-summoner/' + summonerID,
    json: true
  }
  return rp(options)
}

// Returns a promise for getAllLeaguePositionsForSummoner that resolves to the
// returned JSON from the Riot API positions/by-summoner/. endpoint.
getAllLeaguePositionsForSummoner = function(summonerID, region) {
  const options = {
    method: 'GET',
    uri: APIPROXY + '/rgapi/' + region + '/league/getAllLeaguePositionsForSummoner/' + summonerID,
    json: true
  }
  console.log(options)
  return rp(options)
}

getAllChampionMasteriesForSummoner = function(summonerID, region) {
	const options = {
		method: 'GET',
		uri: `${APIPROXY}/rgapi/${region}/championMastery/getAllChampionMasteries/${summonerID}`,
		json: true
	}
	return rp(options)
}

/**
 * returns Promise resolving into championGG Champion data, sorted by winrate (descending)
 * @param position {'MIDDLE' | 'JUNGLE' | 'TOP' | 'DUO_CARRY' | 'DUO_SUPPORT'}
 * @param rank {'BRONZE' |  'SILVER' |  'GOLD' |  'PLATINUM'  | 'DIAMOND'  | 'MASTER' |  'CHALLENGER'} = 'PLATINUM'
 */
getGGChampionsForRole = function (position, rank = 'PLATINUM') {
  const options = {
    method: 'GET',
    uri: `${APIPROXY}/cggapi/champions?elo=${rank}&sort=winRate-desc`,
    json: true
  }
  return rp(options).then(champions => {
    return champions.filter(champion => champion.role === position)
  })
}

// Returns an approximate "Sharpe" on winrate versus 50%.
rateSignificance = function(winrate, n) {
  return (n * (winrate - 0.5)) / Math.sqrt(n * 0.5 * 0.5)
}

// Returns the numerical champion ID corresponding to the official canonical
// champion name, all lowercase.
getChampionID = function(championName) {
  return {"aatrox":266,"ahri":103,"akali":84,"alistar":12,"amumu":32,"anivia":34,"annie":1,"ashe":22,"aurelion sol":136,"azir":268,"bard":432,"blitzcrank":53,"brand":63,"braum":201,"caitlyn":51,"camille":164,"cassiopeia":69,"cho'gath":31,"corki":42,"darius":122,"diana":131,"draven":119,"dr. mundo":36,"ekko":245,"elise":60,"evelynn":28,"ezreal":81,"fiddlesticks":9,"fiora":114,"fizz":105,"galio":3,"gangplank":41,"garen":86,"gnar":150,"gragas":79,"graves":104,"hecarim":120,"heimerdinger":74,"illaoi":420,"irelia":39,"ivern":427,"janna":40,"jarvan iv":59,"jax":24,"jayce":126,"jhin":202,"jinx":222,"kalista":429,"karma":43,"karthus":30,"kassadin":38,"katarina":55,"kayle":10,"kayn":141,"kennen":85,"kha'zix":121,"kindred":203,"kled":240,"kog'maw":96,"leblanc":7,"lee sin":64,"leona":89,"lissandra":127,"lucian":236,"lulu":117,"lux":99,"malphite":54,"malzahar":90,"maokai":57,"master yi":11,"miss fortune":21,"wukong":62,"mordekaiser":82,"morgana":25,"nami":267,"nasus":75,"nautilus":111,"nidalee":76,"nocturne":56,"nunu":20,"olaf":2,"orianna":61,"ornn":516,"pantheon":80,"poppy":78,"quinn":133,"rakan":497,"rammus":33,"rek'sai":421,"renekton":58,"rengar":107,"riven":92,"rumble":68,"ryze":13,"sejuani":113,"shaco":35,"shen":98,"shyvana":102,"singed":27,"sion":14,"sivir":15,"skarner":72,"sona":37,"soraka":16,"swain":50,"syndra":134,"tahm kench":223,"taliyah":163,"talon":91,"taric":44,"teemo":17,"thresh":412,"tristana":18,"trundle":48,"tryndamere":23,"twisted fate":4,"twitch":29,"udyr":77,"urgot":6,"varus":110,"vayne":67,"veigar":45,"vel'koz":161,"vi":254,"viktor":112,"vladimir":8,"volibear":106,"warwick":19,"xayah":498,"xerath":101,"xin zhao":5,"yasuo":157,"yorick":83,"zac":154,"zed":238,"ziggs":115,"zilean":26,"zyra":143}[championName];
}

// Returns the lowercase official canonical champion name from a nuemrical
// champion ID.
getChampionName = function(championID) {
  return {"1":"annie","2":"olaf","3":"galio","4":"twisted fate","5":"xin zhao","6":"urgot","7":"leblanc","8":"vladimir","9":"fiddlesticks","10":"kayle","11":"master yi","12":"alistar","13":"ryze","14":"sion","15":"sivir","16":"soraka","17":"teemo","18":"tristana","19":"warwick","20":"nunu","21":"miss fortune","22":"ashe","23":"tryndamere","24":"jax","25":"morgana","26":"zilean","27":"singed","28":"evelynn","29":"twitch","30":"karthus","31":"cho'gath","32":"amumu","33":"rammus","34":"anivia","35":"shaco","36":"dr. mundo","37":"sona","38":"kassadin","39":"irelia","40":"janna","41":"gangplank","42":"corki","43":"karma","44":"taric","45":"veigar","48":"trundle","50":"swain","51":"caitlyn","53":"blitzcrank","54":"malphite","55":"katarina","56":"nocturne","57":"maokai","58":"renekton","59":"jarvan iv","60":"elise","61":"orianna","62":"wukong","63":"brand","64":"lee sin","67":"vayne","68":"rumble","69":"cassiopeia","72":"skarner","74":"heimerdinger","75":"nasus","76":"nidalee","77":"udyr","78":"poppy","79":"gragas","80":"pantheon","81":"ezreal","82":"mordekaiser","83":"yorick","84":"akali","85":"kennen","86":"garen","89":"leona","90":"malzahar","91":"talon","92":"riven","96":"kog'maw","98":"shen","99":"lux","101":"xerath","102":"shyvana","103":"ahri","104":"graves","105":"fizz","106":"volibear","107":"rengar","110":"varus","111":"nautilus","112":"viktor","113":"sejuani","114":"fiora","115":"ziggs","117":"lulu","119":"draven","120":"hecarim","121":"kha'zix","122":"darius","126":"jayce","127":"lissandra","131":"diana","133":"quinn","134":"syndra","136":"aurelion sol","141":"kayn","143":"zyra","150":"gnar","154":"zac","157":"yasuo","161":"vel'koz","163":"taliyah","164":"camille","201":"braum","202":"jhin","203":"kindred","222":"jinx","223":"tahm kench","236":"lucian","238":"zed","240":"kled","245":"ekko","254":"vi","266":"aatrox","267":"nami","268":"azir","412":"thresh","420":"illaoi","421":"rek'sai","427":"ivern","429":"kalista","432":"bard","497":"rakan","498":"xayah","516":"ornn"}[championID.toString()];
}

// Returns a list of matchups sorted in descending order of popularity by
// position. Each position contains a list of matchups sorted in descending
// order by winrate significance. In other words, the first element of the
// first element is the highest winrate against the given champion for the most
// popular role. Winrate is expressed from perspective of the non-queried champion.
getBestMatchupsByLane = function(championID, rank = 'PLATINUM') {
  const options = {
    method: 'GET',
    uri: `${APIPROXY}/cggapi/matchupsByChamp/${championID}?elo=${rank}&limit=1000`,
    json: true
  }
  return rp(options).then(function(matchups) {
    let roles = ['DUO_CARRY', 'DUO_SUPPORT', 'MIDDLE', 'TOP', 'JUNGLE'];
    let byRole = roles.map(function(role) {
      let forRole = matchups.filter(function(element) {
        return element._id.role == role && element.count > 500;
      });

      forRole = forRole.map(function(elem) {
        // Normalize so that the winrate is with respect to the non-queried
        // champion.
        let otherChamp = elem.champ2_id;
        let winrate = elem.champ2.winrate;
        if (otherChamp == championID) {
          otherChamp = elem.champ1_id;
          winrate = elem.champ1.winrate;
        }
        return {
          count: elem.count,
          championID: otherChamp,
          winrate: winrate
        };
      });

      // Sort descending by significance of winrate.
      forRole.sort(function(a, b) {
        let sigA = rateSignificance(a.winrate, a.count);
        let sigB = rateSignificance(b.winrate, b.count);

        if (sigA < sigB) {
          return 1;
        }
        if (sigA > sigB) {
          return -1;
        }
        return 0;
      });

      let counts = forRole.map(function(elem) {
        return elem.count;
      });

      return {
        role: role,
        count: counts.reduce((a, b) => a+b, 0),
        matchups: forRole
      };
    });

    // Sort descending by popularity of the role.
    return byRole.sort(function(a, b) {
      if (a.count < b.count) {
        return 1;
      }
      if (a.count > b.count) {
        return -1;
      }
      return 0;
    });
  });
}

module.exports = {
	"getBySummonerName": getBySummonerName,
	"getRecentMatchList": getRecentMatchList,
	"getMatch": getMatch,
	"getAllLeaguePositionsForSummoner": getAllLeaguePositionsForSummoner,
	"getAllChampionMasteriesForSummoner": getAllChampionMasteriesForSummoner,
  "getGGChampionsForRole": getGGChampionsForRole,
  "getBestMatchupsByLane": getBestMatchupsByLane,
  "getChampionName": getChampionName,
  "getChampionID": getChampionID,
  "getCurrentMatch": getCurrentMatch
}

