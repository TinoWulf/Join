import {
  database,
  ref,
  set,
  auth,
  createUserWithEmailAndPassword,
} from "./connection.js";

const nameRef = document.getElementById("sign-up-name");
const emailRef = document.getElementById("sign-up-email");
const passwordRef = document.getElementById("sign-up-password");
const confirmPasswordRef = document.getElementById("confirmPassword");
const nameLabel = document.getElementById("nameLabel");
const emailLabel = document.getElementById("emailLabel");
const acceptPolicyRef = document.getElementById("acceptPolicy");
const signUpBtn = document.getElementById("signUpBtn");
const signupForm = document.getElementById("signupForm");

let nameError = document.getElementById("nameError");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("error-password");
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
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const userId = user.uid;
    const userProfileRef = ref(database, "users/" + userId);
    await set(userProfileRef, {
      id: userId,
      name: name,
      email: email,
      acceptedPolicy: acceptedPolicy,
      created_at: user.metadata.creationTime
        ? new Date(user.metadata.creationTime).getTime()
        : Date.now(),
    });
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
  const contactId = Date.now();
  const contactRef = ref(database, `contacts/${contactId}`);
  try {
    const contact = { id: contactId, name: name, email: email, phone: "" };
    await set(contactRef, contact);
  } catch (error) {
    openErrorPage();
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
function catchError(error) {
  emailError.classList.remove("hide");
  if (error.code === "auth/email-already-in-use") {
    emailError.innerText = "This email address is already in use.";
    emailLabel.classList.add("password-error");
  } else if (error.code === "auth/invalid-email") {
    emailLabel.classList.add("password-error");
    emailError.innerText = "Invalid email address.";
  } else if (error.code === "auth/weak-password") {
    passwordError.innerText =
      "Password is too weak. Please choose a stronger password.";
    passwordOutlineError.classList.add("password-error");
    passwordOutlineErrorConfirm.classList.add("password-error");
  } else {
    passwordError.innerText = "An error occurred. Please try again.";
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
    if (password == confirmPassword) {
      try {
        await signUpUser(email, password, name, acceptedPolicy);
        await createContactBySignUp(name, email);
        signupForm.reset();
        showSucessMessage();
      } catch (error) {
        catchError(error);
      }
    }
  });
}


/**
 * Checks if the given email string has a valid format.
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}


/**
 * Validates a user's name.
 * - Must be longer than 2 characters
 * - Cannot contain numbers
 * @param {string} name - The name input value.
 * @returns {{ valid: boolean, msg: string }} Validation result.
 */
function validateName(name) {
  const value = name.trim();
  if (value.length <= 2) return { valid: false, msg: "Name must be more than 2 characters." };
  if (/\d/.test(value))   return { valid: false, msg: "Name cannot contain numbers." };
  return { valid: true, msg: "" };
}


/**
 * Validates an email address.
 * @param {string} email - The email input value.
 * @returns {{ valid: boolean, msg: string }} Validation result.
 */
function validateEmail(email) {
  if (!isValidEmail(email.trim())) {
    return { valid: false, msg: "Invalid email. Please check your email." };
  }
  return { valid: true, msg: "" };
}



/**
 * Validates password and confirmation fields.
 * - Cannot be empty
 * - must be long than 5 charaters
 * - Must match each other
 * @param {string} password - The password input.
 * @param {string} confirm - The confirmation input.
 * @returns {{ valid: boolean, msg: string }} Validation result.
 */
function validatePasswords(password, confirm) {
  if (!password || !confirm) return { valid: false, msg: "Passwords cannot be empty." };
  if (password.length<6) return { valid: false, msg: "Password must be long than 5 caraters." };
  if (password !== confirm)  return { valid: false, msg: "Passwords do not match." };
  return { valid: true, msg: "" };
}


/**
 * Updates UI (label + error message) based on validation result.
 * @param {{valid: boolean, msg: string}} validation - The validation result.
 * @param {HTMLElement} label - The input label or wrapper element.
 * @param {HTMLElement} error - The error message container element.
 * @param {boolean} showErrors - Whether errors should be shown yet (depends on if field is "touched").
 */
function updateFieldUI(validation, label, error, showErrors) {
  if (!showErrors) {
    label.classList.remove("password-error");
    error.innerText = "";
    return;
  }
  if (!validation.valid) {
    label.classList.add("password-error");
    error.innerText = validation.msg;
  } else {
    label.classList.remove("password-error");
    error.innerText = "";
  }
}


/**
 * Enables or disables the submit button based on form validity.
 * @param {boolean} isValid - Whether the whole form is valid.
 */
function setButtonState(isValid) {
  signUpBtn.disabled = !isValid;
}


/**
 * Validates the entire form:
 * - Runs all field validators
 * - Updates UI for touched fields
 * - Enables/disables submit button
 */
function validateForm() {
  const nameCheck   = validateName(nameRef.value);
  const emailCheck  = validateEmail(emailRef.value);
  const passCheck   = validatePasswords(passwordRef.value, confirmPasswordRef.value);
  const policyCheck = { valid: acceptPolicyRef.checked, msg: "" };
  updateFieldUI(nameCheck, nameLabel, nameError, touched.name);
  updateFieldUI(emailCheck, emailLabel, emailError, touched.email);
  updateFieldUI(passCheck, passwordOutlineError, passwordError, touched.password || touched.confirm);
  const allValid = nameCheck.valid && emailCheck.valid && passCheck.valid && policyCheck.valid;
  setButtonState(allValid);
}


/**
 * Tracks whether each field has been interacted with ("touched").
 * This prevents showing errors before user has typed/blurred a field.
 */
const touched = { name: false, email: false, password: false, confirm: false, policy: false };


/**
 * Binds validation to an input field on both `input` and `blur` events.
 * @param {HTMLInputElement} input - The input element.
 * @param {string} key - The field key (matches `touched` object).
 */
function bindValidation(input, key) {
  input.addEventListener("input", () => { touched[key] = true; validateForm(); });
  input.addEventListener("blur",  () => { touched[key] = true; validateForm(); });
}

bindValidation(nameRef, "name");
bindValidation(emailRef, "email");
bindValidation(passwordRef, "password");
bindValidation(confirmPasswordRef, "confirm");

acceptPolicyRef.addEventListener("change", () => {
  touched.policy = true;
  validateForm();
});

document.addEventListener("DOMContentLoaded", validateForm);


/**
 * Displays success message for 2s, then redirects to login page.
 */
function showSucessMessage() {
  const successMessage = document.getElementById("success-message");
  successMessage.classList.remove("hide");
  setTimeout(() => {
    successMessage.classList.add("hide");
    window.location.href = "login.html";
  }, 2000);
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


/**
 * open the Error page with location.href
 */
function openErrorPage() {
  window.location.href = "error.html";
}


/**
 * clear the localstorage if a user click to privacy or legacy page without been login.
 */
function clearCurrentUser() {
  if (localStorage.getItem("userName")) {
    localStorage.removeItem("userName");
  } else {
    localStorage.clear();
  }
}


window.clearCurrentUser = clearCurrentUser;
setupSignUp();
