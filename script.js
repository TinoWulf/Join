/**
 * Loads the navigation menu from "menu-bar.html" and inserts its HTML content
 * into the element with the ID "navbar". Logs the fetched HTML to the console.
 * If the fetch fails, logs an error message to the console.
 *
 * @function
 * @returns {void}
 */
function loadMenu() {
  fetch("menu-bar.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar").innerHTML = html;
    })
    .catch((error) => console.error("Failed to load nav:", error));
}

loadMenu();

function getAbbreviation(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}


function callUserData(){
  let actualUser = localStorage.getItem("userName");
  if (actualUser && actualUser !== 'null') {
    document.getElementById('initial-user').textContent = getAbbreviation(actualUser);
  } else {
    document.getElementById('initial-user').textContent = 'G';
  }
}


function openBoard() {
  window.location.href = "board.html";
}

function openSummary() {
  if(localStorage.getItem("userName")){
    localStorage.removeItem("userName");
    console.log(" User logged out");
    return window.location.href = "summary.html";
  }
  else{
    localStorage.clear();
    return window.location.href = "summary.html";
  }
}

const items = document.querySelectorAll('.menu-btn');

  items.forEach(item => {
    item.addEventListener('click', () => {
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      console("i was clicked")
      console.log(item);
    });
  });


function showLogout(){
  document.getElementById('popup').classList.toggle("popupshow");
  document.getElementById('popup').classList.toggle("back");
}

function logOut(){
  localStorage.clear();
  return window.location.href = "login.html";
}





