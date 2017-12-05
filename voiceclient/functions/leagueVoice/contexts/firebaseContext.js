module.exports = function(context) {
  const firebase = require('firebase');
  const admin = require('firebase-admin');

  context.register('firebase.admin').asConstant(admin);

  /*
   * The firebase app for the current logged-in user, or null if the user is not logged in.
   */
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
  /* Same as above, but will promp the user if not logged in. */
  context.register('firebase.appOrPrompt').asFunction({
    deps: [ 'app', 'assistant' ],
    func({ app, assistant }) {
      if (app != null)
        return app;
      assistant.askForSignIn();
      throw false;
    }
  });

  /*
   * The current user's data from firebase, or null if not logged in.
   */
  context.register('firebase.userData').asFunction({
    deps: [ 'app' ],
    func({ app: firebase }) {
      let user = firebase.auth().currentUser;
      if (!user)
        return null;
      let userRef = firebase.database().ref('users').child(user.uid);
      return userRef.once('value')
        .then(snap => snap.val());
    },
    cleanup({ app: firebase, $value }) {
      if (!firebase || !$value)
        return;
      let user = firebase.auth().currentUser;
      if (!user || !user.uid)
        return;
      let userRef = firebase.database().ref('users').child(user.uid);
      userRef.set($value)
        .catch(e => console.error('Error saving user data in cleanup.', e));
    }
  });
  /* Same as above, but will promp the user instead of returning null. */
  context.register('firebase.userDataOrPrompt').asFunction({
    deps: [ 'appOrPrompt', 'userData' ],
    func({ appOrPrompt: app, userData }) {
      return userData;
    }
  });

  /*
   * The current user's summoner, or null if not logged in or no summoner data.
   */
  context.register('firebase.summonerData').asFunction({
    deps: [ 'app', 'userData' ],
    func({ app: firebase, userData }) {
      console.log('user data', userData);
      if (!userData)
        return null;
      let summonerKey = userData.summonerKey;
      if (!summonerKey)
        return null;
      return firebase.database().ref('summoners').child(summonerKey)
        .once('value')
        .then(snap => snap.val());
    }
  });
  /*
   * Same as above, but will promp the user instead of returning null.
   */
  context.register('firebase.summonerDataOrPrompt').asFunction({
    deps: [ 'userDataOrPrompt', 'summonerData', 'assistant' ],
    func({ userDataOrPrompt: userData, summonerData, assistant }) {
      if (summonerData)
        return summonerData;
      assistant.ask(`You need to set up your summoner before I can help with that. Say "Register my summoner" to set up your summoner.`);
      throw false;
    }
  })
};
