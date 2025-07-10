
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// jerrys Firebase Config
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
  if (!signupForm) return;

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const acceptPolicy = document.getElementById("acceptPolicy");
    const message = document.getElementById("message");

    if (!acceptPolicy.checked) {
      message.innerText = "Bitte akzeptieren Sie die Datenschutzrichtlinie.";
      message.style.display = "flex";
      return; // blockiere die Registrierung
    }

    if (password !== confirmPassword) {
      message.innerText = "Passwörter stimmen nicht überein!";
      message.style.display = "flex";
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      message.innerText = `Registrierung erfolgreich, Willkommen ${name}!`;
      message.style.display = "flex";
    } catch (err) {
      console.error(err);
      message.innerText = `Ein Fehler ist aufgetreten, bitte versuchen Sie es erneut`;
      message.style.display = "flex";
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
      // document.getElementById("messageLogin").innerText = "Your email or password is incorrect.";
      let emailStyle = document.getElementById("email");
      let passwordStyle = document.getElementById("password");
      emailStyle.style.borderColor = "red";
      document.getElementById("password");
      passwordStyle.style.borderColor = "red";
    }
  });
}
console.log("i'm the main script");
setupSignUp();
setupLogin();
