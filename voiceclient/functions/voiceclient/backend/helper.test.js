const chai = require('chai')
const expect = chai.expect
describe('helper.js', function () {
  const helper = require('./helper')
  describe('sortByAppearanceInArray', function () {
    const array = [4,5,3]

    it('if elements are not in order, second element is treated as smaller', function () {
      expect(helper.sortByAppearanceInArray(array, 3,4)).to.be.above(0)
    });
    it('if elements are in order, first element is treated as smaller', function () {
      expect(helper.sortByAppearanceInArray(array, 4,5)).to.be.below(0)
    });
    it('if both elements do not exist in array, they are treated as equal', function () {
      expect(helper.sortByAppearanceInArray(array, 10,1)).to.equal(0)
    });
    it('if first element does not exist in array, second element is treated as smaller', function () {
      expect(helper.sortByAppearanceInArray(array, 10,4)).to.be.above(0)
    });
    it('if second element does not exist in array', function () {
      expect(helper.sortByAppearanceInArray(array, 4,10)).to.be.below(0)
    });
  });
});