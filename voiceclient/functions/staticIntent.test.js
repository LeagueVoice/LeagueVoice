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

const staticIntent = require('./staticIntent');

describe('staticIntent general', function() {

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

describe('staticIntent championAbilityCost', function() {

  it('zyra q', function(done) {
    staticIntent.championAbilityCost(sim({
      champion: 'Zyra',
      ability: 'Q'
    }, string => {
      expect(string).to.equal("Zyra's Q costs 70 mana at all levels.");
    }))
    .then(done, done);
  });

  it('zyra w', function(done) {
    staticIntent.championAbilityCost(sim({
      champion: 'Zyra',
      ability: 'W'
    }, string => {
      expect(string).to.equal("Zyra's W costs 1 Seed.");
    }))
    .then(done, done);
  });

  it('talon e', function(done) {
    staticIntent.championAbilityCost(sim({
      champion: 'Talon',
      ability: 'E'
    }, string => {
      expect(string).to.equal("Talon's E has no cost.");
    }))
    .then(done, done);
  });
});
