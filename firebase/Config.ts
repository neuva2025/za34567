import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// Firebase configuration from your JSON
const firebaseConfig = {
  apiKey: "AIzaSyC7cIck3dsUf2bx7xIhlr6xDdjRIOBrrXI",
  authDomain: "zapp-36bc3.firebaseapp.com",
  projectId: "zapp-36bc3",
  storageBucket: "zapp-36bc3.firebasestorage.app",
  messagingSenderId: "963211595174",
  appId: "1:963211595174:android:0bcc395e8f7797be179367",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);

export { db, auth, functions };