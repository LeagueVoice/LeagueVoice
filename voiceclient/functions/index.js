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

// Export firebase functions
module.exports = {};
Object.assign(module.exports, require('./voiceclient/'));
Object.assign(module.exports, require('./apiproxy/'));
Object.assign(module.exports, require('./oauth2/'));
