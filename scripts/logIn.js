import{app, database,ref, get, onValue, set, update, auth, signInWithEmailAndPassword} from './connection.js'

let loginError = document.getElementById('error-message');
let loginEmailRef = document.getElementById('email');
let loginPasswordRef = document.getElementById('password');
let userName = "";

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    findUserWithId(user.uid)
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
      // openSummary();
    } catch (e) {
      if(e.code == "auth/invalid-credential"){
        loginError.innerText="Invalid email or password.";
      }else{
        loginError.innerText= e.message;
      }
    }
  });
}

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

function openSummaryPara(name) {
  window.location.href = `summary.html?name=${name} `;
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
setupLogin();
