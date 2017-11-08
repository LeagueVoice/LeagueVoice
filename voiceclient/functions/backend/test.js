const foo = require('./client.js');

foo.getBySummonerName('foo', 'bar').then(function(res) {
  console.log(res);
})
