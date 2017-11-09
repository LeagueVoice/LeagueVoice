const chai = require('chai');
const expect = chai.expect;

function sim(args, callback) {
  return {
    getArgument(key) {
      return args[key];
    },
    tell: callback
  };
}

describe('staticIntent.js', function() {
  const staticIntent = require('./staticIntent');
  it('test championAttackRange', function(done) {
    staticIntent.championAttackRange(sim({
      champion: 'Zyra'
    }, string => {
      expect(string).to.equal("Zyra's auto attack range is 575 units.");
    }))
    .then(done, done);
  });
  it('test championCount', function(done) {
    staticIntent.championCount(sim({
      champion: 'Zyra'
    }, string => {
      expect(string).to.match(/\d{3,} champions\./);
    }))
    .then(done, done);
  });
});
