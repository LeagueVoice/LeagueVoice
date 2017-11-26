"use strict";

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const kms = require('./kms');

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json()); // to support JSON-encoded bodies (not needed for google).
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded.


//// CONFIGURATION ////

const CLIENT_ID = 'google';
let CLIENT_SECRET_PROMISE;
try {
  CLIENT_SECRET_PROMISE = kms.decrypt(functions.config().oauth2.google_secret, 'google-secret-key');
}
catch(e) {
  CLIENT_SECRET_PROMISE = Promise.resolve(process.env.CLIENT_SECRET);
}

CLIENT_SECRET_PROMISE.catch(console.error);


//// CONSTANTS ////

const TOKEN_TYPE = {
  AUTH: 'AUTH_CODE',
  REFRESH: 'REFRESH',
  ACCESS: 'ACCESS'
};
const TYPE_TO_CRYPTO_KEY = {
  [TOKEN_TYPE.AUTH]: 'auth-code-key',
  [TOKEN_TYPE.REFRESH]: 'refresh-token-key'
};

const TEN_MINUTES_IN_SECONDS = 10 * 60;
const ONE_HOUR_IN_SECONDS = 60 * 60;
const TEN_YEARS_IN_SECONDS = (Math.PI * 1e8)|0;


//// FUNCTIONS ////

function assertEqual(actual, expected, name='[value]') {
  if (actual !== expected)
    throw new Error(`Wrong ${name}: ${JSON.stringify(actual)}, expected ${JSON.stringify(actual)}.`);
}

function getSecondsToLive(type) {
  if (type === TOKEN_TYPE.AUTH)
    return TEN_MINUTES_IN_SECONDS;
  if (type === TOKEN_TYPE.REFRESH)
    return TEN_YEARS_IN_SECONDS;
  if (type === TOKEN_TYPE.ACCESS)
    return ONE_HOUR_IN_SECONDS;
  throw new Error(`Unknown type: ${JSON.stringify(type)}.`);
}

// returns { token, secondsToLive }
function createToken(type, clientId, userId) {
  assertEqual(clientId, CLIENT_ID, 'clientId'); // For now, only google.

  let secondsToLive = getSecondsToLive(type);
  if (type === TOKEN_TYPE.ACCESS) {
    // Access tokens are special.
    // We generate them directly with firebase admin.
    return admin.auth().createCustomToken(userId, { origin: 'google_auth_code' })
      .then(token => ({
        secondsToLive,
        token
      }));
  }

  let exp = (Date.now() / 1000)|0 + secondsToLive;
  let tokenData = {
    type, clientId, userId, exp
  };
  let plaintext = JSON.stringify(tokenData);
  let cryptoKeyId = TYPE_TO_CRYPTO_KEY[type];
  return kms.encrypt(plaintext, cryptoKeyId)
    .then(token => ({
      secondsToLive,
      token
    }));
}

// Takes in raw token, as well as type, clientId.
// AKA `createToken(...).then(data => validateToken(data.token, ...))`
// Returns a Promise of the `userId`, or rejects with error.
function checkToken(token, type, clientId) {
  // Special for access. Also `clientId` not checked.
  if (type == TOKEN_TYPE.ACCESS)
    return admin.auth().verifyIdToken(token)
      .then(decodedToken => decodedToken.uid);

  let cryptoKeyId = TYPE_TO_CRYPTO_KEY[type];
  if (!cryptoKeyId)
    throw new Error(`Unknown type: ${JSON.stringify(type)}.`);

  return kms.decrypt(token, cryptoKeyId)
    .then(plaintext => {
      let tokenData = JSON.parse(plaintext);
      assertEqual(tokenData.type, type, 'token type');
      assertEqual(tokenData.clientId, clientId, 'token clientId');
      // assertEqual(tokenData.userId, userId, 'token userId');
      let minExp = Date.now() / 1000;
      let maxExp = minExp + getSecondsToLive(type);
      if (minExp > tokenData.exp)
        throw new Error(`Token expired`);
      if (tokenData.exp > maxExp)
        throw new Error(`Token from the future`);
      return tokenData.userId;
    });
}


//// EXPRESS APP ////

// For use by our client to generate AUTHORIZATION_CODEs.
app.post('/auth', (req, res, next) => {
  let { id_token } = req.body;
  return checkToken(id_token, TOKEN_TYPE.ACCESS, null)
    .then(userId => createToken(TOKEN_TYPE.AUTH, CLIENT_ID, userId))
    .then(authCode => /* SUCCESS */ res.status(200).json(authCode))
    .catch(e => {
      console.error(e);
      res.status(401).json({
        error: 'bad id_token',
      });
    });
});

// For use by google.
// https://developers.google.com/actions/identity/oauth2-code-flow#handle_token_exchange_requests
app.post('/token', (req, res) => {
  // client_id=GOOGLE_CLIENT_ID&client_secret=GOOGLE_CLIENT_SECRET
  let { client_id, client_secret, grant_type } = req.body;
  client_secret = client_secret.trim();
  return CLIENT_SECRET_PROMISE.then(CLIENT_SECRET => {
    if (client_secret !== CLIENT_SECRET) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    if ('authorization_code' === grant_type) {
      // REFRESH_TOKEN (and ACCESS_TOKEN) from AUTHORIZATION_CODE
      // grant_type=authorization_code&code=AUTHORIZATION_CODE
      let authCode = req.body.code;
      return checkToken(authCode, TOKEN_TYPE.AUTH, client_id)
        .then(userId => {
          let refreshTokenPromise = createToken(TOKEN_TYPE.REFRESH, client_id, userId);
          let accessTokenPromise = createToken(TOKEN_TYPE.ACCESS, client_id, userId);
          return Promise.all([ refreshTokenPromise, accessTokenPromise ]);
        })
        .then(([ refreshToken, accessToken ]) => {
          // SUCCESS.
          res.status(200).json({
            token_type: 'bearer',
            access_token: accessToken.token,
            expires_in: accessToken.secondsToLive,
            refresh_token: refreshToken.token
          });
        })
        .catch(e => {
          console.error(e);
          res.status(400).json({ error: 'invalid_grant' });
        });
    }
    else if ('refresh_token' === grant_type) {
      // ACCESS_TOKEN from REFRESH_TOKEN
      // grant_type=refresh_token&refresh_token=REFRESH_TOKEN
      let refreshToken = req.body.refresh_token;
      return checkToken(refreshToken, TOKEN_TYPE.REFRESH, client_id)
        .then(userId => createToken(TOKEN_TYPE.ACCESS, client_id, userId))
        .then(accessToken => {
          // SUCCESS.
          res.status(200).json({
            token_type: 'bearer',
            access_token: accessToken.token,
            expires_in: accessToken.secondsToLive
          });
        })
        .catch(e => {
          console.error(e);
          res.status(400).json({ error: 'invalid_grant' });
        });
    }
    else {
      res.status(400).json({
        error: 'wrong grant_type',
        msg: JSON.stingify(grant_type)
      });
    }
  })
  .catch(e => {
    console.error(e);
    res.status(500).json({ error: 'internal server error' });
  });
});

const oauth2 = functions.https.onRequest(app);

module.exports = {
  oauth2
};
