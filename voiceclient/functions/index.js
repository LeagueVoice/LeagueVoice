'use strict';

// SHIM
Object.values = Object.values || function(obj) {
  return Object.keys(obj).map(k => obj[k]);
};
Object.entries = Object.entries || function(obj) {
  return Object.keys(obj).map(k => [ k, obj[k] ]);
};

// Initialize firebase globally.
require('./initFirebase');

// Export firebase function(s).
// Only exported needed based on env.FUNCTION_NAME.
module.exports = {};
const functions = [ 'voiceclient', 'apiproxy', 'oauth2' ];
const funcName = process.env.FUNCTION_NAME;
console.log(`FUNCTION_NAME: ${JSON.stringify(funcName)}.`);
functions.filter(f => !funcName || f === funcName)
  .forEach(f => Object.assign(module.exports, require(`./${f}/`)));
