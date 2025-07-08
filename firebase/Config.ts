import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication
import { getFunctions } from 'firebase/functions';  // Import Firebase Functions
import Constants from 'expo-constants';

// Firebase configuration (use your own Firebase keys here)
const firebaseConfig = {
  
        apiKey: "AIzaSyC7cIck3dsUf2bx7xIhlr6xDdjRIOBrrXI",
        authDomain: "zapp-36bc3.firebaseapp.com",
        projectId: "zapp-36bc3",
        storageBucket: "zapp-36bc3.firebasestorage.app",
        messagingSenderId: "963211595174",
        appId: "1:963211595174:android:0bcc395e8f7797be179367",
      
  
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Functions
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app); 
 // Initialize Firebase Functions

// Export Firestore, Auth, and Functions instances
export {  db, auth, functions };


