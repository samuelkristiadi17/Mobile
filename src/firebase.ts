import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyABove0YqFEaA_zDKAlnIaW6ItmUQHJ-4c",
  authDomain: "foodkasir-bc6f6.firebaseapp.com",
  projectId: "foodkasir-bc6f6",
  storageBucket: "foodkasir-bc6f6.firebasestorage.app",
  messagingSenderId: "710022360674",
  appId: "1:710022360674:web:30974645a2ec626163eb3b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

