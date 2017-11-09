const chai = require('chai');
const expect = chai.expect
describe('championSelect.js', function () {
  const championSelect = require('./championSelect')
  before(function () {
    const app = require('../firebase/app')
    const tracking = require('./tracking');
    return tracking.createUser("test", "TeemoEater", "NA1").then(data => {
      return tracking.getUser('test')
    });
  });
  describe('suggestChampionToPick', function () {
    it('returns 5 things', function () {
      return championSelect.suggestChampionToPick('test', 'MIDDLE').then(data => {
        expect(data).to.be.an('Array').and.to.have.length(5)
      })
    });
  });
});