// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBF2kV3mm97Sy9gr6GzAnS86nTpCLugOUw",
  authDomain: "messagewebapp01.firebaseapp.com",
  projectId: "messagewebapp01",
  storageBucket: "messagewebapp01.firebasestorage.app",
  messagingSenderId: "931058279411",
  appId: "1:931058279411:web:a0eb9d280f99e87669e886",
  measurementId: "G-XDZ2M03387",
  databaseURL: "https://messagewebapp01-default-rtdb.asia-southeast1.firebasedatabase.app", // Update this URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getDatabase(app);
const analytics = getAnalytics(app);
export { db, ref, set, push, onValue };