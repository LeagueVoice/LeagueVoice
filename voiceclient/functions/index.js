'use strict';

// Initialize polyfill and firebase globally.
require('./init');

// Export firebase function(s).
// Only exported needed based on env.FUNCTION_NAME.
module.exports = {};
const functions = [ 'leagueVoice', 'apiproxy', 'oauth2' ];
const funcName = process.env.FUNCTION_NAME;
console.log(`FUNCTION_NAME: ${JSON.stringify(funcName)}.`);
functions.filter(f => !funcName || f === funcName)
  .forEach(f => Object.assign(module.exports, require(`./${f}/`)));
