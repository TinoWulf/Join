import{app, database,ref, set, update, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from './connection.js'

const nameRef = document.getElementById("sign-up-name");
const emailRef = document.getElementById("sign-up-email");
const passwordRef = document.getElementById("sign-up-password");
const confirmPasswordRef = document.getElementById("confirmPassword");

const acceptPolicyRef = document.getElementById("acceptPolicy");
const message = document.getElementById("message");

let emailError = document.getElementById('emailError');
let signUpError = document.getElementById('sign-up-error');
let passwordError = document.getElementById('error-passord');
let loginError = document.getElementById('error-message');


let loginEmailRef = document.getElementById('email');
let loginPasswordRef = document.getElementById('password');

async function signUpUser(email, password, name, acceptedPolicy) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userId = user.uid;
    const userProfileRef = ref(database, 'users/' + userId);
    await set(userProfileRef, {
      id: userId,
      name: name,
      email: email, 
      acceptedPolicy: acceptedPolicy,
      created_at: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),
    });
    message.innerText = `Registrierung erfolgreich, Willkommen ${name}!`;
    return user;
  } catch (error) {
    catchError(error);
  }
}


function catchError(error){
  if (error.code === 'auth/email-already-in-use') {
      emailError.innerText="This email address is already in use.";
    } else if (error.code === 'auth/invalid-email') {
      emailError.innerText="Invalid email address.";
    } else if (error.code === 'auth/weak-password') {
      signUpError.innerText="Password is too weak. Please choose a stronger password.";
    } else {
      signUpError.innerText="An error occurred. Please try again.";
    }
    throw error;
}


function setupSignUp() {
  const signupForm = document.getElementById("signupForm");
  if (!signupForm) return;
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameRef.value;
    const email = emailRef.value;
    const password = passwordRef.value;
    const confirmPassword = confirmPasswordRef.value;
    const acceptedPolicy = acceptPolicyRef;
    if (!acceptedPolicy.checked) {
      signUpError.innerText = "Bitte akzeptieren Sie die Datenschutzrichtlinie.";
      return;
    }
    if (password !== confirmPassword) {
      passwordError.innerText = "Passwörter stimmen nicht überein!";
      return;
    }
    try {
      await signUpUser(email, password, name, acceptedPolicy);
      window.location.href = "login.html";
    } catch (error) {
      catchError(error)
    }
  });
}


async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user.name);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      console.error("Error: Invalid email or password.");
    } else {
      console.error("Error logging in:", error.message);
    }
    throw error;
  }
}

function setupLogin() {
  const loginForm = document.getElementById("loginform");
  if (!loginForm) return;
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginEmailRef.value;
    const password = loginPasswordRef.value;
    try {
      await loginUser(email, password);
      loginForm.reset();
      openSummary();
    } catch (e) {
      if(e.code == "auth/invalid-credential"){
        loginError.innerText="Invalid email or password.";
      }else{
        loginError.innerText= e.message;
      }
    }
  });
}


function openSummary() {
  window.location.href = "summary.html";
}


window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.getElementById('overlay').classList.add('hide');
  }, 1700); 
  const urlParams = new URLSearchParams(window.location.search);
  const message = urlParams.get('message');
  const statusMessageElement = document.getElementById('successSignUpMessage');
  if (message && statusMessageElement) {
    setTimeout(() => {
      statusMessageElement.innerHTML = message;
      document.getElementById('success-message').classList.toggle('hide');
    }, 2200); 
    setTimeout(() => {
      document.getElementById('main-login').classList.toggle('hide');
    }, 2500); 
  }else{
    document.getElementById('main-login').classList.toggle('hide');
    document.getElementById('success-message').classList.toggle('hide');
  }
});


window.openSummary = openSummary;
setupSignUp();
setupLogin();
