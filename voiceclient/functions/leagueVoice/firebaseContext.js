module.exports = function(context) {
  const firebase = require('firebase');
  const admin = require('firebase-admin');

  context.register('firebaseAdmin').asConstant(admin);

  context.register('firebaseApp').asFunction({
    deps: [ 'assistant', 'firebaseAdmin', 'request' ],
    func({ assistant, firebaseAdmin: admin, request }) {
      let user = assistant.getUser();
      if (!user)
        return null;

      let options = admin.app().options;
      let optionKeys = [ 'databaseURL', 'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId' ];
      let newOptions = {};
      optionKeys.forEach(key => newOptions[key] = options[key]);

      let uniq = [ user.userId, Date.now(), Math.random() ].join(':');
      console.log(`init firebase app "${uniq}".`);
      let firebaseApp = firebase.initializeApp(newOptions, uniq);
      if (!user.accessToken)
        return firebaseApp;
      return firebaseApp.auth().signInWithCustomToken(user.accessToken)
        .then(() => firebaseApp);
    },
    cleanup({ firebaseApp: app }) {
      if (app) {
        console.log(`delete firebase app "${app.name}".`);
        app.delete();
      }
    }
  });
};
