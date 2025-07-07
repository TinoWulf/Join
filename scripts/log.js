
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// dein Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAxdb4CbOOtGb6A5XsP6kRjCgqsWPbwNCk",
  authDomain: "join-login-data.firebaseapp.com",
  projectId: "join-login-data",
  storageBucket: "join-login-data.firebasestorage.app",
  messagingSenderId: "218354818242",
  appId: "1:218354818242:web:aef67a0223f6e4f492ef5b",
  measurementId: "G-PPCD6JRHGM"
};

// Firebase einmal initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// =============================
// SIGN UP Funktion
// =============================
function setupSignUp() {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return; // nur aktivieren, wenn das Formular vorhanden ist

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("message").innerText = "Passwörter stimmen nicht überein!";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      document.getElementById("message").innerText = `Registrierung erfolgreich, Willkommen ${name}!`;
    } catch (err) {
      console.error(err);
      document.getElementById("message").innerText = err.message;
    }
  });
}

// =============================
// LOGIN Funktion
// =============================
function setupLogin() {
  const loginForm = document.getElementById("loginform");
  if (!loginForm) return; // nur aktivieren, wenn das Formular vorhanden ist

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      document.getElementById("messageLogin").innerText = `Willkommen zurück, ${userCredential.user.email}!`;
      window.location.href = "./board.html";
    } catch (err) {
      console.error(err);
      document.getElementById("messageLogin").innerText = "Login fehlgeschlagen: " + err.message;
    }
  });
}

// =============================
// Funktionen einmal aufrufen
// =============================
setupSignUp();
setupLogin();
