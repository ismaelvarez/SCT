// Import the functions you need from the SDKs you need

import * as firebase from 'firebase/app'
import { getAnalytics } from "firebase/analytics";

import * as authLib from 'firebase/auth';
import * as firestoreLib from 'firebase/firestore/lite';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFLhnJHFhQRbncPTgmb4ehI1QHuFr4PyE",
  authDomain: "small-canary-telescope.firebaseapp.com",
  projectId: "small-canary-telescope",
  storageBucket: "small-canary-telescope.appspot.com",
  messagingSenderId: "1017387988463",
  appId: "1:1017387988463:web:945e3a605773965c8d721a",
  measurementId: "G-4GDLWBZ3NX"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig, { persistence : authLib.browserSessionPersistence});
const analytics = getAnalytics(app);

// utils
const db = firestoreLib.getFirestore(app);
const auth = authLib.getAuth()

authLib.setPersistence(auth, authLib.browserLocalPersistence);

// collection references
const usersCollection = firestoreLib.collection(db, "users")
const opticsCollection = firestoreLib.collection(db, "optics")
const observingPetitionsCollection = firestoreLib.collection(db, "observing_petitions")

// export utils/refs
export {
  db,
  firestoreLib,
  auth,
  authLib,
  analytics, 
  usersCollection,
  opticsCollection,
  observingPetitionsCollection
}