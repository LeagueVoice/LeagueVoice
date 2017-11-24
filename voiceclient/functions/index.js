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
const voiceclient = require('./voiceclient/');
const apiproxy = require('./apiproxy/');

// Export firebase functions
module.exports = {};
Object.assign(module.exports, voiceclient);
Object.assign(module.exports, apiproxy);
