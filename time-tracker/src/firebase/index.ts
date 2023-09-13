// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"

import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDPHrOY9caW_0jGSy1kHSmwCin7RXb95bc",
    authDomain: "time-tracker-7594d.firebaseapp.com",
    projectId: "time-tracker-7594d",
    storageBucket: "time-tracker-7594d.appspot.com",
    messagingSenderId: "471364055440",
    appId: "1:471364055440:web:c6eec284cea7d0fc5f0315",
    measurementId: "G-1S0R4B33K7"
  };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}

