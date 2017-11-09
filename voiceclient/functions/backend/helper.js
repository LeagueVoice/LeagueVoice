const helper = {
  sortByAppearanceInArray: function (array, a, b) {
    if (array.indexOf(a) === -1 && array.indexOf(b) === -1) {
      return 0
    }
    if (array.indexOf(a) === -1) {
      return 1
    }
    if (array.indexOf(b) === -1) {
      return -1
    }
    return array.indexOf(a) - array.indexOf(b)
  }
};
module.exports = helper