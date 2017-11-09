# Endpoints

## `/cggapi/` Endpoints

See https://github.com/UghThatGuyAgain/cGG#usage. Parameters are included in the
path, optional tags are forwarded from query params.

## `/rgapi/` Endpoints

### `/rgapi/:platform/championMastery/getAllChampionMasteries/:summonerid`
### `/rgapi/:platform/championMastery/getChampionMastery/:summonerid`
### `/rgapi/:platform/championMastery/getChampionMasteryScore/:summonerid`
### `/rgapi/:platform/champion/getChampions/`
### `/rgapi/:platform/champion/getChampionsById/:championid`
### `/rgapi/:platform/league/getChallengerLeague/:queueid`
### `/rgapi/:platform/league/getAllLeaguesForSummoner/:summonerid`
### `/rgapi/:platform/league/getMasterLeague/:queueid`
### `/rgapi/:platform/league/getAllLeaguePositionsForSummoner/:summonerid`
### `/rgapi/:platform/masteries/getMasteryPagesBySummonerId/:summonerid`
### `/rgapi/:platform/match/getMatch/:matchid`
### `/rgapi/:platform/match/getMatchlist/:accountid`
### `/rgapi/:platform/match/getRecentMatchlist/:accountid`
### `/rgapi/:platform/match/getMatchTimeline/:matchid`
### `/rgapi/:platform/runes/getRunePagesBySummonerId/:summonerid`
### `/rgapi/:platform/spectator/getCurrentGameInfoBySummoner/:summonerid`
### `/rgapi/:platform/spectator/getFeaturedGames/`
### `/rgapi/:platform/summoner/getByAccountId/:accountid`
### `/rgapi/:platform/summoner/getBySummonerName/:summonername`
### `/rgapi/:platform/summoner/getBySummonerId/:summonerid`

***
### `/rgapi/:platform/match/getMatchIdsByTournamentCode/:tournamentid`
### `/rgapi/:platform/match/getMatchByTournamentCode/:id`

### `/rgapi/:platform/lolStaticData/getChampionList/`
### `/rgapi/:platform/lolStaticData/getChampionById/:id`
### `/rgapi/:platform/lolStaticData/getItemList/`
### `/rgapi/:platform/lolStaticData/getItemById/:id`
### `/rgapi/:platform/lolStaticData/getLanguageStrings/`
### `/rgapi/:platform/lolStaticData/getLanguages/`
### `/rgapi/:platform/lolStaticData/getMapData/`
### `/rgapi/:platform/lolStaticData/getMasteryList/`
### `/rgapi/:platform/lolStaticData/getMasteryById/:id`
### `/rgapi/:platform/lolStaticData/getProfileIcons/`
### `/rgapi/:platform/lolStaticData/getRealm/`
### `/rgapi/:platform/lolStaticData/getRuneList/`
### `/rgapi/:platform/lolStaticData/getRuneById/:id`
### `/rgapi/:platform/lolStaticData/getSummonerSpellList/`
### `/rgapi/:platform/lolStaticData/getSummonerSpellById/:id`
### `/rgapi/:platform/lolStaticData/getVersions/`
### `/rgapi/:platform/lolStatus/getShardData/`


## Uses
- teemojs (Riot API)
- cgg (Champion.GG API)
