module.exports = function(context) {
  const firebase = require('firebase');
  const admin = require('firebase-admin');

  context.register('firebase.admin').asConstant(admin);

  context.register('firebase.app').asFunction({
    deps: [ 'assistant', 'admin', 'request' ],
    func({ assistant, admin, request }) {
      let user = assistant.getUser();
      if (!user)
        return null;

      let options = admin.app().options;
      let optionKeys = [ 'databaseURL', 'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId' ];
      let newOptions = {};
      optionKeys.forEach(key => newOptions[key] = options[key]);

      let uniq = [ user.userId, Date.now(), Math.random() ].join(':');
      console.log(`Init firebase app "${uniq}".`);
      let firebaseApp = firebase.initializeApp(newOptions, uniq);
      if (!user.accessToken)
        return firebaseApp;
      return firebaseApp.auth().signInWithCustomToken(user.accessToken)
        .catch(e => {
          console.log('Failed to to auth user.');
          console.log(e);
        })
        .then(() => firebaseApp);
    },
    cleanup({ $value: app }) {
      if (app) {
        console.log(`Delete firebase app "${app.name}".`);
        app.delete();
      }
    }
  });

  context.register('firebase.userData').asFunction({
    deps: [ 'app' ],
    func({ app: firebase }) {
      let user = firebase.auth().currentUser;
      if (!user)
        return user;
      let userRef = firebase.database().ref('users').child(user.uid);
      return userRef.once('value')
        .then(snap => snap.val());
    },
    cleanup({ app: firebase, $value }) {
      if (!firebase || !$value)
        return;
      let user = firebase.auth().currentUser;
      if (!user)
        return;
      let userRef = firebase.database().ref('users').child(user.uid);
      userRef.set($value)
        .catch(e => console.error('Error saving user data in cleanup.', e));
    }
  });

  context.register('firebase.summonerData').asFunction({
    deps: [ 'app', 'userData' ],
    func({ app: firebase, userData }) {
      console.log('user data', userData);
      if (!userData)
        return null;
      let summonerKey = userData.summonerKey;
      return firebase.database().ref('summoners').child(summonerKey)
        .once('value')
        .then(snap => snap.val());
    }
  })
};
