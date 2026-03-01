// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrZAdLvPDW972CLKk0GDTM0Xo0w8wQRoE",
  authDomain: "resume-builder-4723d.firebaseapp.com",
  projectId: "resume-builder-4723d",
  storageBucket: "resume-builder-4723d.firebasestorage.app",
  messagingSenderId: "575647597078",
  appId: "1:575647597078:web:54aec3af2eba0683f5ab37",
  measurementId: "G-R7N0KJKSBC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);