import firebase from "firebase/compat/app"
import "firebase/compat/firestore"
import "firebase/compat/auth"

firebase.initializeApp({

apiKey: "AIzaSyDia7ZRyrdI-qQZATefScinLj7O-Ae_rDE",
  authDomain: "theretailproject-6f5b2.firebaseapp.com",
  projectId: "theretailproject-6f5b2",
  storageBucket: "theretailproject-6f5b2.firebasestorage.app",
  messagingSenderId: "396544414031",
  appId: "1:396544414031:web:dcf79519b9832e7752353a"

});

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore, firebase };
