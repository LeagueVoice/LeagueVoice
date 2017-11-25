const admin = require('firebase-admin');

function getUserInfo(assistant) {
  let user = assistant.getUser();
  if (!user) {
    assistant.ask("Your user is null.");
    return;
  }
  assistant.ask(JSON.stringify(user, null, 2));
}

function getFirebaseInfo(assistant) {
  let user = assistant.getUser();
  if (!user) {
    assistant.ask("Your user is null.");
    return;
  }
  
  admin.auth().verifyIdToken(user.accessToken)
    .then(token => {
      //var uid = decodedToken.uid;
      assistant.ask(JSON.stringify(token, null, 2));
    })
    .catch(e => {
      assistant.ask("Token verification check passed: " + e);
    });
}

module.exports = {
  getUserInfo,
  getFirebaseInfo
};
