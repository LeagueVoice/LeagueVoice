const firebase = require('firebase');

const user = {
  getById: function (uniqueID) {
    return new Promise((resolve, reject) => {
      firebase.database()
        .ref('users')
        .once('value', function (snapshot) {
          resolve(snapshot.val()[uniqueID])
        }, reject)
    })
  }
}

module.exports = user;