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

describe('staticIntent championAbilityDamage', function() {
  it('zyra q', function(done) {
    staticIntent.championAbilityDamage(sim({
      champion: 'Zyra',
      ability: 'Q'
    }, string => {
      expect(string).to.equal(
        'Zyra\'s Q deals 60 magic damage at level 1, increasing by 35 magic damage per level, to 200 magic damage at level 5, plus 60% AP.');
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

  it('yasuo e', function(done) {
    staticIntent.championAbilityCost(sim({
      champion: 'Yasuo',
      ability: 'E'
    }, string => {
      expect(string).to.equal("Yasuo's E has no cost.");
    }))
    .then(done, done);
  });
});
