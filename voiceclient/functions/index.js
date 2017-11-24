'use strict';

const voiceclient = require('./voiceclient/');
const apiproxy = require('./apiproxy/');

module.exports = {};
Object.assign(module.exports, voiceclient);
Object.assign(module.exports, apiproxy);
