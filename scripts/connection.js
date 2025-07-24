import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {getDatabase,ref,set,onValue,update,push,remove,get,query} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile }from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDkdA360D1fwMdP8uys9jJuCA1aGRUNpC8",
  authDomain: "join-8035a.firebaseapp.com",
  databaseURL:
    "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-8035a",
  storageBucket: "join-8035a.firebasestorage.app",
  messagingSenderId: "266948276237",
  appId: "1:266948276237:web:7db67cd17d2462270ca544",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app,auth, database, ref, set, onValue, update, push, remove, get, query, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile };
