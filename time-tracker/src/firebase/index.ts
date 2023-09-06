// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from 'firebase/database';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjnBuG6zNtBUBXPKQhYrAMXOxOwuaf_e8",
    authDomain: "time-tracking-f0b2d.firebaseapp.com",
    projectId: "time-tracking-f0b2d",
    storageBucket: "time-tracking-f0b2d.appspot.com",
    messagingSenderId: "54305379615",
    appId: "1:54305379615:web:5b8517f969dd78b8d58c2a",
    measurementId: "G-QH4S5E04ND"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {db}

