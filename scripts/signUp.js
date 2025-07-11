import{app, database,ref, set, update, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from './connection.js'

const nameRef = document.getElementById("sign-up-name");
const emailRef = document.getElementById("sign-up-email");
const passwordRef = document.getElementById("sign-up-password");
const confirmPasswordRef = document.getElementById("confirmPassword");

const acceptPolicyRef = document.getElementById("acceptPolicy");
const successMessage = document.getElementById("success-message");
const mainSignup = document.getElementById("main-signup");
const signUpBtn = document.getElementById("signUpBtn");

let emailError = document.getElementById('emailError');
let signUpError = document.getElementById('sign-up-error');
let passwordError = document.getElementById('error-passord');


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
    successMessage.style.display = "block";
    mainSignup.style.display = "none";
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
    if (password !== confirmPassword) {
      passwordError.innerText = "Passwörter stimmen nicht überein!";
      return;
    }
    verifyPolicy(acceptedPolicy);
    try {
      await signUpUser(email, password, name, acceptedPolicy);
      signupForm.reset();
      const successMessage = encodeURIComponent("You Signed Up successfully!");
      window.location.href = `login.html?message=${successMessage}`;
    } catch (error) {
      catchError(error)
    }
  });
}


function verifyPolicy(acceptedPolicy){
        if (!acceptedPolicy.checked) {
        signUpError.innerText = "You must accept the policy.";
        return;
    } else {
        signUpError.innerText = ""; 
        signUpBtn.removeAttribute("disabled");
    }
}

setupSignUp();