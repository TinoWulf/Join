import{database,ref, set, auth, createUserWithEmailAndPassword} from './connection.js'

const nameRef = document.getElementById("sign-up-name");
const emailRef = document.getElementById("sign-up-email");
const passwordRef = document.getElementById("sign-up-password");
const confirmPasswordRef = document.getElementById("confirmPassword");
const nameLabel = document.getElementById("nameLabel");
const emailLabel = document.getElementById("emailLabel");
const acceptPolicyRef = document.getElementById("acceptPolicy");
const signUpBtn = document.getElementById("signUpBtn");
const signupForm = document.getElementById("signupForm");

let emailError = document.getElementById('emailError');
let signUpError = document.getElementById('sign-up-error');
let passwordError = document.getElementById('error-passord');
let passwordOutlineError = document.querySelector(".password");
let passwordOutlineErrorConfirm = document.querySelector(".password-confirm");


/**
 * Registers a new user with the provided email, password, and name, and stores their profile in the database.
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
    await set(userProfileRef, {id: userId, name: name, email: email, acceptedPolicy: acceptedPolicy,created_at: user.metadata.creationTime ? new Date(user.metadata.creationTime).getTime() : Date.now(),});
    return user;
  } catch (error) {
    catchError(error);
  }
}


/**
 * 
 * this function is used to create a contact in the database by signup.
 * @param {string} name user name
 * @param {string} email user email
 */
async function createContactBySignUp(name, email) {
  const contactId = Date.now()
  const contactRef = ref(database, `contacts/${contactId}`);
  try{
    const contact = {id: contactId, name: name, email: email, phone: ''};
    await set(contactRef, contact);
  }
  catch(error){
    console.log(error)
    // openErrorPage();
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
  emailError.classList.remove("hide");
  if (error.code === 'auth/email-already-in-use') {
      emailError.innerText="This email address is already in use.";
      emailLabel.classList.add("password-error");
    } else if (error.code === 'auth/invalid-email') {
      emailLabel.classList.add("password-error");
      emailError.innerText="Invalid email address.";
    } else if (error.code === 'auth/weak-password') {
      signUpError.innerText="Password is too weak. Please choose a stronger password.";
      passwordOutlineError.classList.add("password-error");
      passwordOutlineErrorConfirm.classList.add("password-error");
    } else {
      signUpError.innerText="An error occurred. Please try again.";
    }
    setTimeout(() => {
      hideErrorMessages();
    }, 3000);
    throw error;
}


/**
 * Hides error messages by adding the "hide" class to the relevant elements after a delay.
 */
function hideErrorMessages() {
  emailError.classList.add("hide");
  emailLabel.classList.remove("password-error");
  signUpError.classList.add("hide");
  passwordError.classList.add("hide");
  passwordOutlineError.classList.remove("password-error");
  passwordOutlineErrorConfirm.classList.remove("password-error");
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
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = nameRef.value;
    const email = emailRef.value;
    const password = passwordRef.value;
    const confirmPassword = confirmPasswordRef.value;
    const acceptedPolicy = acceptPolicyRef;
    verifyPassword(password, confirmPassword);
    verifyPolicy(acceptedPolicy);
    if(password==confirmPassword){
      try {
        await signUpUser(email, password, name, acceptedPolicy);
        await createContactBySignUp(name, email);
        signupForm.reset();
        showSucessMessage()
      } catch (error) {
        openErrorPage();
      }
    }
  });
}


function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


emailRef.addEventListener('blur', function(){
  const name = nameRef.value;
  if(name=="" || name.length<=2){
    nameLabel.classList.add("password-error");
  }else{
    nameLabel.classList.remove("password-error");
  }
})

emailRef.addEventListener('blur', function(){
  const email = emailRef.value;
  let check = isValidEmail(email);
  if(!check){
  emailLabel.classList.add("password-error");
  emailError.innerText="Invalid email address.";
  }else{
  emailLabel.classList.remove("password-error");
  }
})

confirmPasswordRef.addEventListener('blur', function(){
  const confirmPassword = confirmPasswordRef.value;
  if(confirmPassword!=passwordRef.value){
    passwordOutlineError.classList.add("password-error");
    passwordOutlineErrorConfirm.classList.add("password-error");
    passwordError.innerText="the password don't match!";
  }else{
    passwordOutlineError.classList.remove("password-error");
    passwordOutlineErrorConfirm.classList.remove("password-error");
  }
})

/**
 * Displays the success message by removing the "hide" class from the element with ID "success-message".
 * After 2 seconds, hides the message and redirects the user to the login page.
 */
function showSucessMessage() {
    let successMessage = document.getElementById("success-message");
    successMessage.classList.remove("hide");
    setTimeout(() => {
        successMessage.classList.add("hide");
        window.location.href = `login.html`; 
    }, 2000);
}


acceptPolicyRef.addEventListener("change", function () {
  signUpBtn.disabled = !acceptPolicyRef.checked;
});


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


/**
 * this function verifies if the password and confirm password fields match
 * if they do not match, it displays an error message
 * @param {string} password  the user's password
 * @param {string} confirmPassword  the user's confirm password
 * @returns 
 */
function verifyPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    passwordError.classList.remove("hide");
    passwordError.innerText = "Your passwords don't match. Please try again.";
    passwordOutlineError.classList.add("password-error");
    passwordOutlineErrorConfirm.classList.add("password-error");
    return;
  }
}


const passwordField = document.getElementById("sign-up-password");
const toggleIcon = document.getElementById("eyePassword");
const passwordField2 = document.getElementById("confirmPassword");
const toggleIcon2 = document.getElementById("eyePassword2");
let realValue = ""; 
let isVisible = false;


/**
 * this listener toggles the visibility of the password icon when a user start typing in the password field
 */
passwordField.addEventListener('input', function(){
  toggleIcon.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">`;
})


/**
 * this listener toggles the visibility of the password icon when a user start typing in the password field
 */
passwordField2.addEventListener('input', function(){
  toggleIcon2.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">`;
})


/**
 * this listener change the visibility of the password value when a user typing in the password field
 */
passwordField.addEventListener("input", (e) => {
  const newValue = e.target.value;
  if (newValue.length < realValue.length) {
    realValue = realValue.slice(0, newValue.length);
  } else {
    realValue += newValue[newValue.length - 1];
  }
  passwordField.value = isVisible ? realValue : "*".repeat(realValue.length);
});


passwordField2.addEventListener("input", (e) => {
  const newValue = e.target.value;
  if (newValue.length < realValue.length) {
    realValue = realValue.slice(0, newValue.length);
  } else {
    realValue += newValue[newValue.length - 1];
  }
  passwordField2.value = isVisible ? realValue : "*".repeat(realValue.length);
});


/**
 * Toggles the visibility of the password input field.
 * Updates the input value to show either the real password or masked characters,
 * and switches the visibility icon accordingly.
 * @function
 * @global
 * @returns {void}
 */
function togglePassword() {
  isVisible = !isVisible;
  passwordField.value = isVisible ? realValue : "*".repeat(realValue.length);
  toggleIcon.innerHTML = isVisible? `<img src="./assets/icons/visibility.png" alt="lock">`: `<img src="./assets/icons/visibility_off.png" alt="lock">`;
}


/**
 * open the Error page with location.href
 */

function openErrorPage() {
  window.location.href = "error.html";
}


/**
 * Toggles the visibility of the password input field.
 * Updates the input value to show either the real password or masked characters,
 * and switches the visibility icon accordingly.
 *
 * @function
 * @global
 * @returns {void}
 */
function togglePasswordConfirm() {
  isVisible = !isVisible;
  passwordField2.value = isVisible ? realValue : "*".repeat(realValue.length);
  toggleIcon2.innerHTML = isVisible? `<img src="./assets/icons/visibility.png" alt="lock">`: `<img src="./assets/icons/visibility_off.png" alt="lock">`;
}

window.togglePassword = togglePassword;
window.togglePasswordConfirm = togglePasswordConfirm;

setupSignUp();