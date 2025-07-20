import{database,ref, set, auth, createUserWithEmailAndPassword} from './connection.js'

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
let passwordOutlineError = document.querySelector(".password");
let passwordOutlineErrorConfirm = document.querySelector(".password-confirm");


/**
 * Registers a new user with the provided email, password, and name, and stores their profile in the database.
 *
 * @async
 * @function
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} name - The user's full name.
 * @param {boolean} acceptedPolicy - Indicates whether the user has accepted the policy.
 * @returns {Promise<Object|undefined>} The created user object on success, or undefined if an error occurs.
 */
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


/**
 * Handles authentication errors by displaying user-friendly messages
 * based on the error code, and then rethrows the error.
 *
 * @param {Object} error - The error object returned from the authentication process.
 * @param {string} error.code - The specific error code identifying the type of authentication error.
 * @throws Will rethrow the provided error after displaying the appropriate message.
 */
function catchError(error){
  if (error.code === 'auth/email-already-in-use') {
      emailError.innerText="This email address is already in use.";
    } else if (error.code === 'auth/invalid-email') {
      emailError.innerText="Invalid email address.";
    } else if (error.code === 'auth/weak-password') {
      signUpError.innerText="Password is too weak. Please choose a stronger password.";
      passwordOutlineError.classList.add("password-error");
      passwordOutlineErrorConfirm.classList.add("password-error");
    } else {
      signUpError.innerText="An error occurred. Please try again.";
    }
    throw error;
}


/**
 * Sets up the sign-up form submission handler.
 * Handles form validation, including password confirmation and policy acceptance,
 * and attempts to register a new user. On success, redirects to the login page with a success message.
 * On failure, displays appropriate error messages.
 *
 * Assumes the existence of referenced DOM elements and helper functions:
 * - nameRef, emailRef, passwordRef, confirmPasswordRef, acceptPolicyRef, passwordError
 * - verifyPolicy(acceptedPolicy)
 * - signUpUser(email, password, name, acceptedPolicy)
 * - catchError(error)
 */
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
      passwordError.innerText = "Your passwords don't match. Please try again.";
      passwordOutlineError.classList.add("password-error");
      passwordOutlineErrorConfirm.classList.add("password-error");
      return;
    }
    verifyPolicy(acceptedPolicy);
    try {
      await signUpUser(email, password, name, acceptedPolicy);
      signupForm.reset();
      const successMessage = encodeURIComponent("You Signed Up successfully!");
      window.location.href = `login.html?message=${successMessage}`;
    } catch (error) {
      catchError(error);
    }
  });
}


/**
 * Verifies if the policy checkbox has been accepted.
 * Displays an error message if not accepted and disables the sign-up button.
 * Clears the error message and enables the sign-up button if accepted.
 *
 * @param {HTMLInputElement} acceptedPolicy - The checkbox input element representing policy acceptance.
 */
function verifyPolicy(acceptedPolicy){
        if (!acceptedPolicy.checked) {
        signUpError.innerText = "You must accept the policy.";
        return;
    } else {
        signUpError.innerText = ""; 
        signUpBtn.removeAttribute("disabled");
    }
}

function togglePassword() {
  const passwordField = document.getElementById("sign-up-password");
  const toggleIcon = document.getElementById("eyePassword");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.innerHTML = `<img src="./assets/icons/visibility.png" alt="lock">`; 
  } else {
    passwordField.type = "password";
    toggleIcon.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">` ;
  }
}
function togglePasswordConfirm() {
  const passwordField = document.getElementById("confirmPassword");
  const toggleIcon = document.getElementById("eyePassword2");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.innerHTML = `<img src="./assets/icons/visibility.png" alt="lock">`; 
  } else {
    passwordField.type = "password";
    toggleIcon.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">` ;
  }
}

window.togglePassword = togglePassword;
window.togglePasswordConfirm = togglePasswordConfirm;

setupSignUp();