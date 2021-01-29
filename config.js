import * as firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyA9UPljd6ZLnVEb4NmsfB6AefaO6h6L7AI",
    authDomain: "willy-app-f4ae2.firebaseapp.com",
    projectId: "willy-app-f4ae2",
    storageBucket: "willy-app-f4ae2.appspot.com",
    messagingSenderId: "351437122482",
    appId: "1:351437122482:web:e56d301192dee5880d52ab"
  };
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
export default firebase.firestore();