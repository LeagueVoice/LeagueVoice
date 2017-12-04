module.exports = function(context) {
  const admin = require('firebase-admin');

  context.register('debug.UserInfo').asFunction({
    deps: [ 'assistant' ],
    func({ assistant }) {
      let user = assistant.getUser();
      if (!user) {
        assistant.ask("Your user is null.");
        return;
      }
      assistant.ask(JSON.stringify(user, null, 2));
    }
  });

  context.register('debug.FirebaseInfo').asFunction({
    deps: [ 'assistant', 'firebaseApp' ],
    func({ assistant, firebaseApp: app }) {
      if (!app) {
        assistant.ask("Your app is null.");
        return;
      }

      var user = app.auth().currentUser;
      if (user) {
        // User is signed in.
        assistant.ask(`Signed in as ${JSON.stringify(user)}.`);
      } else {
        // No user is signed in.
        assistant.ask("Your app is not null, but you are not signed in.");
      }

      // // https://stackoverflow.com/a/37492640/2398020
      // admin.auth().verifyIdToken(user.accessToken)
      //   .then(token => {
      //     //var uid = decodedToken.uid;
      //     assistant.ask(JSON.stringify(token, null, 2));
      //   })
      //   .catch(e => {
      //     assistant.ask("Token verification check failed: " + e);
      //   });
    }
  });
}
