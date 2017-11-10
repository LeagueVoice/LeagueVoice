// Formats an array of values.
// Used for ability cooldowns, damage, costs,
// things which may change per level.
function formatValues(arr, units) {
  // Constant.
  if ((new Set(arr)).size === 1)
    return `${arr[0]} ${units} at all levels`;
  // Linear.
  let deltas = [];
  for (let i = 1; i < arr.length; i++)
    deltas.push(arr[i] - arr[i - 1]);
  if ((new Set(deltas)).size === 1) {
    let delta = deltas[0];
    let order = delta < 0 ? 'decreasing' : 'increasing';

    return `${arr[0]} ${units} at level 1, ${order} by ${Math.abs(delta)} ${units} per level, to `
      + `${arr[arr.length - 1]} ${units} at level ${arr.length}`;
  }
  let strs = arr.map((x, i) => `${x} ${units} at level ${i + 1}`);
  strs[strs.length - 1] = 'and ' + strs[strs.length - 1];
  return strs.join(', ');
}

module.exports = formatValues;
