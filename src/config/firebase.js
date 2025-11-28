// src/config/firebase.js (after modifications)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Access key via Vite's global environment object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vault-b78d7.firebaseapp.com",
  projectId: "vault-b78d7",
  storageBucket: "vault-b78d7.firebasestorage.app",
  messagingSenderId: "146171266218",
  appId: "1:146171266218:web:3c73e1759ec1358a683cd3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);