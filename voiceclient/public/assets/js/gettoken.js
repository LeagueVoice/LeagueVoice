'use strict';
function getToken() {
  let arr = new Uint8Array(16);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  }
  else {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = ((1 << 8) * Math.random()) | 0;
    }
  }
  let token = arr.reduce((a, b) => a + b.toString(16), '');
  return token;
}
