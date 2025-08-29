import{database,ref, get, auth, signInWithEmailAndPassword} from './connection.js';
let loginError = document.getElementById('error-message');
let loginEmailRef = document.getElementById('email');
let loginPasswordRef = document.getElementById('password');
const inputEmail = document.getElementById('label-email');
const inputPassword = document.getElementById('label-password');
const passwordField = document.getElementById("password");
const toggleIcon = document.getElementById("eyePassword");
let realValue = ""; 
let isVisible = false;
let userName = "";


/**
 * signs in a user with the provided email and password. Using Firebase Authentication,
 * @async
 * @param {string} email  user email adress
 * @param {*string} password user password
 */
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    findUserWithId(user.uid);
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      showErrorLogin(loginError, inputPassword,inputEmail );
    } else {
      openErrorPage();
    }
  }
}


function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}



/**
 * Sets up the login form submission handler.
 * Prevents default form submission, retrieves user credentials,
 * and attempts to log in the user.
 * If an error occurs, it opens the error page.
 */
function setupLogin() {
  const loginForm = document.getElementById("loginform");
  if (!loginForm) return;
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = loginEmailRef.value;
    const password = loginPasswordRef.value;
    if(!email || !isValidEmail(email) || !password){
      showErrorLogin(loginError, inputPassword,inputEmail );
      return
    }
    try {
      await loginUser(email, password);
    } catch (e) {
     openErrorPage();
    }
  });
}


/**
 * Displays a login error message and highlights the email and password input fields.
 * The error message and highlighting are removed after 2 seconds.
 *
 * @param {HTMLElement} loginError - The element where the error message will be displayed.
 * @param {HTMLElement} inputPassword - The password input element to highlight on error.
 * @param {HTMLElement} inputEmail - The email input element to highlight on error.
 */
function showErrorLogin(loginError,inputPassword,inputEmail){
    loginError.innerText="Check your email and password. Please try again.";
    inputPassword.classList.add('login-error');
    inputEmail.classList.add('login-error');
    setTimeout(()=>{
      loginError.innerText="";
      inputPassword.classList.remove('login-error');
      inputEmail.classList.remove('login-error');
    }, 3000);
}


/**
 * this listener toggles the visibility of the password icon when a user start typing in the password field
 */
passwordField.addEventListener('input', function(){
  toggleIcon.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">`;
})


/**
 * Toggles the visibility of the password input field.
 * Updates the input value to show either the real password or masked characters,
 * and switches the visibility icon accordingly.
 *
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


/**
 * Retrieves a user from the database by their user ID and handles the result.
 *
 * @async
 * @function findUserWithId
 * @param {string} userId - The unique identifier of the user to find.
 * @returns {void}
 *
 * @description
 * Listens for changes to the user data at the specified user ID path in the database.
 * If the user exists, extracts the user's name and calls `openSummaryPara` with it.
 */
async function findUserWithId(userId){
  const userRef = ref(database, "users/" + userId);
 try {
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      const user = snapshot.val(); 
      userName= user.name; 
      openSummaryPara(userName); 
    } else {
      return null; 
    }
  } catch (error) {
    openErrorPage();
  }
}


/**
 * Redirects the browser to the summary page with the specified name as a query parameter.
 *
 * @param {string} name - The name to be included in the summary page URL as a query parameter.
 */
function openSummaryPara(name) {
  window.location.href = `summary.html?name=${name} `;
}


/**
 * Redirects the user to the summary page after handling localStorage.
 * If "userName" exists in localStorage, it removes only that item.
 * Otherwise, it clears the entire localStorage.
 * In both cases, navigates to "summary.html".
 *
 * @returns {string} The new URL of the summary page.
 */
function openSummary() {
  if(localStorage.getItem("userName")){
    localStorage.removeItem("userName");
    return window.location.href = "summary.html";
  }
  else{
    localStorage.clear();
    return window.location.href = "summary.html";
  }
}


function clearCurrentUser() {
  if(localStorage.getItem("userName")){
    localStorage.removeItem("userName");
  }
  else{
    localStorage.clear();
  }
}

/**
 * open the Error page with location.href
 */
function openErrorPage() {
  window.location.href = "error.html";
}


window.openSummary = openSummary;
window.clearCurrentUser = clearCurrentUser;
window.openSummaryPara = openSummaryPara;
window.togglePassword = togglePassword;
setupLogin();
