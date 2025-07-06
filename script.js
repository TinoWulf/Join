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


function openBoard() {
  window.location.href = "board.html";
}








