/**
 * Loads the navigation menu from "menu-bar.html" and inserts its HTML content
 * into the element with the ID "navbar". Logs the fetched HTML to the console.
 * If the fetch fails, logs an error message to the console.
 *
 * @function
 * @returns {void}
 */
function loadMenu() {
  try{
  fetch("menu-bar-signup.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("navbar").innerHTML = html;
    })
  }catch(error){
    openErrorPage();
  };
  
    
}

loadMenu();

/**
 * Returns the abbreviation formed by taking the first letter of each word in the input string and converting it to uppercase.
 *
 * @param {string} str - The input string to abbreviate.
 * @returns {string} The resulting abbreviation in uppercase.
 */
function getAbbreviation(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}


/**
 * Retrieves the current user's name from localStorage and updates the
 * 'initial-user' element's text content with the user's abbreviation.
 * If no user is found, sets the text content to 'G'.
 *
 * Depends on a function `getAbbreviation` to generate the abbreviation.
 */
function callUserData(){
  let actualUser = localStorage.getItem("userName");
  if (actualUser=='Guest') {
    document.getElementById('initial-user').textContent = 'G';
  } else if( actualUser && actualUser !== 'Guest') {
    document.getElementById('initial-user').textContent = getAbbreviation(actualUser);
  }else{
    document.getElementById('initial-user').classList.add("hide");
  }
}


/**
 * open the Error page with location.href
 */
function openErrorPage() {
  window.location.href = "error.html";
}


/**
 * open the Board page with location.href
 */
function openBoard() {
  window.location.href = "board.html";
}

/**
 * Handles user session for the summary page.
 * 
 * If a "userName" exists in localStorage, logs the user out by removing "userName"
 * and redirects to "summary.html". Otherwise, clears all localStorage data and
 * redirects to "summary.html".
 *
 * @returns {string} The new URL after redirection to "summary.html".
 */
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


/**
 * Formats a date string into a specified format.
 *
 * @param {string} dateString - The date string to format (parsable by Date constructor).
 * @param {"numeric"|"long"} [format="numeric"] - The format to use: "numeric" for DD/MM/YYYY, "long" for a long-form date (e.g., January 1, 2024).
 * @returns {string} The formatted date string, or the original string if the format is unrecognized.
 */
function formatDueDate(dateString, format = "numeric") {
  const date = new Date(dateString);
  if (format === "numeric") {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  if (format === "long") {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }
  return dateString; 
}



/**
 * Toggles the visibility and background state of the logout popup.
 * 
 * This function toggles the "popupshow" and "back" CSS classes
 * on the element with the ID "popup", typically used to show or hide
 * a logout confirmation dialog with a background overlay.
 */
function showLogout(){
  document.getElementById('popup').classList.toggle("popupshow");
  document.getElementById('popup').classList.toggle("back");
  document.getElementById('popup-header-background').classList.toggle("back");
}

/**
 * Logs the user out by clearing all data from localStorage
 * and redirecting to the login page.
 *
 * @returns {string} The URL of the login page.
 */
function logOut(){
  localStorage.clear();
  return window.location.href = "login.html";
}


/**
 * Capitalizes the first letter of each word in a given name string.
 *
 * @param {string} name - The name string to capitalize.
 * @returns {string} The capitalized name string.
 */
function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}





