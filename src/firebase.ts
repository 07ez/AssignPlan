// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZzgJRCf1xHJCkAvW6f4Uzw3xC5NflFqE",
  authDomain: "assignplan-0701.firebaseapp.com",
  projectId: "assignplan-0701",
  storageBucket: "assignplan-0701.firebasestorage.app",
  messagingSenderId: "318585258391",
  appId: "1:318585258391:web:c98cd7be1e1827f50ac4d2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;