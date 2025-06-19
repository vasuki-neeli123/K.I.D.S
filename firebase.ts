// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // <--- ADD THIS IMPORT

const firebaseConfig = {
  apiKey: "AIzaSyBf03orFZxFKg180TdAJqQPA2CW07o4lr4",
  authDomain: "kids-64c62.firebaseapp.com",
  projectId: "kids-64c62",
  storageBucket: "kids-64c62.appspot.com",
  messagingSenderId: "85445151085",
  appId: "1:85445151085:web:f707ad01a7670a1602f264"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // <--- ADD THIS LINE TO INITIALIZE STORAGE

export { db, auth, storage }; // <--- ADD 'storage' TO THE EXPORT LIST