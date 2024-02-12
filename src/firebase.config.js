// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMRd1vEl72pFq4dOpR2P_i3P_RgvXhXxA",
  authDomain: "house-marketplace-app-200c1.firebaseapp.com",
  projectId: "house-marketplace-app-200c1",
  storageBucket: "house-marketplace-app-200c1.appspot.com",
  messagingSenderId: "982886918601",
  appId: "1:982886918601:web:cacfd1f712fd2cba85e018",
  measurementId: "G-1GR8VEKJSG"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();