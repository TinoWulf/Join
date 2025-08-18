const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const nameUser = urlParams.get('user');


if (nameUser && nameUser.trim() !== '') {
  const nameUserTrimmed = nameUser.trim();
  localStorage.setItem("userName", nameUserTrimmed);
}


/**
 * checks the userName in localStorage and if it is 'nouser' load the templateNoUser function 
 * else load the templateHeader function.
 */
function notUser() {
    let menuSide = document.getElementById("menuSide");
    let navLinks = document.getElementById("navLinks");
    const user = localStorage.getItem("userName");
    menuSide.innerHTML = '';
    if (user === 'nouser') {
        navLinks.classList.add("hide");
        menuSide.innerHTML += templateHeaderNoUser();
    }else{
        navLinks.classList.remove("hide");
        menuSide.innerHTML += templateHeader();
    }
   checkIfLegacyPage();
}


/**
 * Checks the current URL to determine if it includes "notice.html" or "policy.html".
 * If "notice.html" is present, it adds the "actived" class to the "legacy" element.
 * If "policy.html" is present, it adds the "actived" class to the "privacy" element.
 * This function is used to highlight the active page in the header menu.
 */
function checkIfLegacyPage() {
    if (window.location.href.includes("notice.html")) {
        document.getElementById("legacy").classList.add("actived");
    }else{
        document.getElementById("privacy").classList.add("actived");
    }
}



/**
 * 
 * @returns {string} A string representing the HTML structure for the header menu when no user is logged in.
 * (the is has click to privay policy and legal notice without been  logged in)
 */
function templateHeaderNoUser(){
    return `<a href="login.html" class="login-no-user" id="login-no-user">
                <div class="menu-btn" id="login-no-user">
                    <img src="./assets/icons/login.png" alt="">
                    <p class="menu-p">Login</p>
                </div>
            </a> 
            <div class="dflex-row">
                <a href="policy.html" id="privacy"><p class="menu-p on-policy">Privacy Policy</p></a>
                <a href="notice.html" id="legacy"><p class="menu-p on-notice">Legal notice</p></a>
            </div>
        `;
}


/**
 * 
 * @returns {string} A string representing the HTML structure for the header menu.
 */
function templateHeader(){
    return `
            <a href="summary.html"><div class="menu-btn" id="summary">
                <img src="./assets/icons/summary.png" alt="">
                <p class="menu-p">Summary</p>
            </div></a>
            <a href="add-task.html"><div class="menu-btn" id="addtask">
                <img src="./assets/icons/add-task.png" alt="">
                <p class="menu-p">Add Task</p>
            </div></a>
            <a href="board.html"><div class="menu-btn" id="board">
                <img src="./assets/icons/board.png" alt="">
                <p class="menu-p">Board</p>
            </div></a>
            <a href="contacts.html"><div class="menu-btn" id="contacts">
                <img src="./assets/icons/contact.png" alt="">
                <p class="menu-p">Contacts</p>
            </div></a> 
        `;
}
