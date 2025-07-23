import{database,ref, onValue, auth, signInWithEmailAndPassword} from './connection.js'

let loginError = document.getElementById('error-message');
let loginEmailRef = document.getElementById('email');
let loginPasswordRef = document.getElementById('password');
const inputEmail = document.getElementById('label-email');
const inputPassword = document.getElementById('label-password');
let userName = "";


async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    findUserWithId(user.uid)
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      loginError.innerText = "Invalid email or password.";
    } else {
      console.error("Error logging in:", error.message);
    }
    throw error;
  }
}


/**
 * Sets up the login form submission handler.
 * Prevents default form submission, retrieves user credentials,
 * attempts to log in the user, and handles errors by displaying
 * appropriate messages.
 *
 * Assumes the existence of:
 * - loginEmailRef: Reference to the email input element.
 * - loginPasswordRef: Reference to the password input element.
 * - loginUser(email: string, password: string): Promise<void> function for authentication.
 * - loginError: Element to display error messages.
 */
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
    } catch (e) {
      if(e.code == "auth/invalid-credential" || e.code === 'auth/user-not-found'){
        loginError.innerText="Check your email and password. Please try again.";
        inputPassword.classList.add('login-error');
        inputEmail.classList.add('login-error');
      }else{
        loginError.innerText= e.message;
      }
    }
  });
}



const passwordField = document.getElementById("password");
const toggleIcon = document.getElementById("eyePassword");
let realValue = ""; 
let isVisible = false;

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
 * Logs an error message if the user is not found or if there is an error retrieving the user.
 */
async function findUserWithId(userId){
  const usersRef = ref(database, "users/" + userId);
  onValue(usersRef, (snapshot) => {
    if (snapshot.exists()) {
      const user = snapshot.val();
      userName = user.name;
      openSummaryPara(userName)
    } else {
      console.log("No user found with ID:", userId);
    }
  }, (error) => {
    console.error("Error retrieving user:", error);
  }
  );
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
window.togglePassword = togglePassword;
setupLogin();
