import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication
import { getFunctions } from 'firebase/functions';  // Import Firebase Functions
import Constants from 'expo-constants';

// Firebase configuration (use your own Firebase keys here)
const firebaseConfig = {
  
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
      
  
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


