// POLYFILL
Object.values = Object.values || function(obj) {
  return Object.keys(obj).map(k => obj[k]);
};
Object.entries = Object.entries || function(obj) {
  return Object.keys(obj).map(k => [ k, obj[k] ]);
};
// Non-standard.
Promise.props = Promise.props || function(obj) {
  let keys = Object.keys(obj);
  return Promise.all(Object.values(obj))
    .then(vals => {
      let result = {};
      vals.forEach((val, i) => result[keys[i]] = val);
      return result;
    });
};

require('./initFirebase');
