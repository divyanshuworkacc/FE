import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqP-wCZ4c4UaiehFRXtn8iuI_UUvo16vI",
  authDomain: "web-app-509ac.firebaseapp.com",
  projectId: "web-app-509ac",
  storageBucket: "web-app-509ac.firebasestorage.app",
  messagingSenderId: "988871776993",
  appId: "1:988871776993:web:ca363e3b89861badc235a0",
  measurementId: "G-SQS72EMFXW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);