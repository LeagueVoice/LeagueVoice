"use strict";

const firebase = require('firebase-admin');
const functions = require('firebase-functions');

const { app, setDistFactor } = require('./app');
const apiproxy = functions.https.onRequest(app);

const instancesRef = firebase.database().ref('apiproxy/instances');
const isOnlineRef = instancesRef.push();
const myId = isOnlineRef.toString().split('/').pop();

isOnlineRef.onDisconnect().remove();
isOnlineRef.set((new Date).toISOString())
  .then(() => instancesRef.on('value', snapshot => {
    let factor = 1 / snapshot.numChildren();
    console.log(`apiproxy[${myId}]: detected instances change, setting distFactor to ${factor}.`);
    setDistFactor(factor);
  }))
  .catch(console.error);

module.exports = {
  apiproxy
};
