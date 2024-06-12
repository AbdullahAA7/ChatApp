import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: "chatapp-e49e5.firebaseapp.com",
  projectId: "chatapp-e49e5",
  storageBucket: "chatapp-e49e5.appspot.com",
  messagingSenderId: "829747292957",
  appId: "1:829747292957:web:cdc9aaf72c9a7b79560ff4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage();
