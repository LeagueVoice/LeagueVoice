module.exports = function(context) {
  const admin = require('firebase-admin');

  context.register('$Debug.UserInfo').asFunction({
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

  context.register('$Debug.FirebaseInfo').asFunction({
    deps: [ 'assistant' ],
    func({ assistant }) {
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
  });
}
