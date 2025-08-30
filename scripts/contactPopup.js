/** This function closes the responsive contact popup.
 * It removes the slide-in animation class and adds a slide-out animation class.
*/
function closeResponsivContact() {
    let popup = document.getElementById("center");
    popup.classList.remove("center"); // Remove slide-in animation
    popup.classList.add("center-out"); // Add slide-out animation
}


/** This function shows the responsive contact popup.
 * It removes the slide-out animation class and adds a slide-in animation class.
*/
function showResponsivContact() {
    document.getElementById("center").classList.remove("center-out"); // Remove slide-out animation
    document.getElementById("center").classList.add("center");
    document.getElementById("center").style.display = "block";
}


/** This function closes the responsive contact popup.
 * It removes the slide-out animation class and adds a slide-in animation class.
*/
function closeResponsivContactadd() {
    document.getElementById("center").classList.remove("center-out"); // Remove slide-out animation
    document.getElementById("center").classList.add("center");
    document.getElementById("center").style.display = "block";
}



/** This function closes the responsive buttons menu.
 * It removes the slide-in animation class and adds a slide-out animation class.
*/
function closeResponsivButtons() {
    if (window.matchMedia("(max-width: 876px)").matches) { // If on mobile, close responsive buttons
        let editButton = document.getElementById("center-top-edit"); // Get edit button
        editButton.classList.remove("slide-in"); // Alte Animation entfernen
        editButton.classList.add("slide-out"); // Neue Animation starten
        editButton.addEventListener("animationend", () => {
            editButton.style.display = "none"; // Nach der Animation ausblenden
        }, { once: true }); // Remove slide-in class after animation ends
    }
}


/** This function handles the completion of deleting a contact.
 * It closes the edit popup, shows a success alert,
 * and clears the contact detail view.
 * It ensures the contact is removed from the UI and the user is informed of the successful deletion.
*/
function finishDelete(hide) {
    if(hide){
        closeEdit(); // Close edit popup
    }
    if (window.matchMedia("(max-width: 876px)").matches) {
        closeResponsivContact(); // Close responsive contact view
    }
    setTimeout(showAlert, 3000);
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully deleted</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    document.getElementById("center-body").innerHTML = "";
}


/** This function toggles the visibility of the alert popup.
*/
function showAlert() { // Toggle alert popup visibility
    document.getElementById('alert').classList.toggle('alert-close');
}


/** This function adds a new contact.
 * It retrieves the values from the input fields, validates them,
 * and if valid, generates a unique userID.
 * It then calls finishAddContact to save the new contact.
 * If the input is valid, it generates a unique ID and calls finishAddContact to save the new contact.
*/
async function addContact() { // Add new contact
    const name = document.getElementById("in-name-add").value;
    const email = document.getElementById("in-email-add").value;
    const number = document.getElementById("in-number-add").value;
    const result = checkInput(name, email, number, "add"); // Validate input
    let userID = Date.now() + getRandomID(100000); // Generate unique ID

    if (result) {
        await finishAddContact(result, userID); // Save contact
        clearInputs("add"); // Clear input fields
    }
}


/** This function closes the edit contact popup, removing the slide-in animation
 * and hiding the background.
 * It also clears the input fields and hides any error messages.
 * It resets the input styles to remove any invalid input indicators.
 * It ensures the popup is hidden and the inputs are cleared for the next use.
*/
function closeEdit() { // Close edit popup
    document.getElementById("popup-edit").classList.remove("slide-in");
    document.getElementById("popup-edit").classList.add("slide-out");
    document.getElementById("popup-background").style.display = "none";
    document.getElementById("popup-edit").style.display = "none"; // Hide popup
    clearInputs("edit"); // Clear input fields
}


/** This function closes the add contact popup, removing the slide-in animation
 * and hiding the background.
 * It also clears the input fields and hides any error messages.
 * It resets the input styles to remove any invalid input indicators.
*/
function closeContactAdd() { // Close add contact popup
    document.getElementById("popup-add").classList.remove("slide-in");
    document.getElementById("popup-add").classList.add("slide-out");
    document.getElementById("popup-background").style.display = "none";
    document.getElementById("popup-add").style.display = "none"; // Hide popup
    clearInputs("add"); // Clear input fields
    clearValidationMessages("add"); // Clear validation messages
}


/** This function opens the responsive add contact popup, which is used on mobile devices.
 * It applies a slide-in animation and sets the popup to be visible.
 * It also ensures the background is displayed as a flex container.
 * After the animation, it removes the slide-in class to reset the state.
*/
function openResponsivContactadd() {
    const popup = document.getElementById("popup-add"); // Get the popup element
    document.getElementById("popup-background").style.display = "flex"; // Show background
    popup.style.display = "flex"; // Show popup
    popup.classList.remove("slide-out"); // Remove slide-out animation
    void popup.offsetWidth; // Force reflow to reset animation state
    popup.classList.add("slide-in"); // Add slide-in animation
    popup.addEventListener("animationend", () => { // After animation ends
        popup.classList.remove("slide-in"); // Remove slide-in class to reset state
    }, { once: true }); // Ensure this runs only once
}


/** * This function opens the add contact popup, either in responsive mode for mobile
 * or with a slide-in animation for desktop.
 * It sets the popup to be visible and applies the appropriate styles.
 */
function openContactAdd() {
    if (window.matchMedia("(max-width: 876px)").matches) {
        openResponsivContactadd(); // If on mobile, show responsive contact view
    }
    else {
        document.getElementById("popup-add").classList.remove("slide-out");
        document.getElementById("popup-background").style.display = "flex";
        document.getElementById("popup-add").style.display = "flex";
        document.getElementById("popup-add").classList.add("slide-in"); // Show popup with slide-in animation
    }
}


/**
 * This function increments the color counter and resets it after 10.
 * Variables used: counter
 */
function triggerCounter() { // Increments color counter
    counter++;
    if (counter == 10) { // Reset after 10
        counter = 0; // Reset color counter
    }
}


/** This function clears the input fields in the specified window (add or edit).
 * It sets the value of each input field to an empty string.
*/
function clearValidationMessages(window) {
    document.getElementById(`invalid-name-${window}`).innerHTML = ""; // Clear validation messages
    document.getElementById(`invalid-email-${window}`).innerHTML = "";
    document.getElementById(`invalid-phone-${window}`).innerHTML = "";
}


/** This function opens the responsive buttons menu.
 * It displays the edit button with a slide-in animation and sets up an event listener to remove the animation class after it ends.
*/
function openButtonsMenu(event) {
    let editButton = document.getElementById("center-top-edit");
    editButton.style.display = "flex";
    editButton.classList.remove("slide-out"); // Alte Animation entfernen
    void popup.offsetWidth; // Reflow erzwingen (damit Animation neu startet)
    editButton.classList.add("slide-in"); // Neue Animation starten
    editButton.addEventListener("animationend", () => {
        editButton.classList.remove("slide-in"); // Remove slide-in class after animation ends
    }, { once: true }); // Remove slide-in class after animation ends
    event.stopPropagation() // Prevent event bubbling
}


/** This function clears the input fields in the add contact popup.
 * It resets the values of the name, email, and phone number inputs to empty strings.
*/
function clearInputs(window) {
    document.getElementById(`in-name-${window}`).value = ""; // Clear inputs
    document.getElementById(`in-email-${window}`).value = "";
    document.getElementById(`in-number-${window}`).value = "";
    document.getElementById(`in-name-${window}`).classList.remove("input-invalid"); // Remove invalid class
    document.getElementById(`in-email-${window}`).classList.remove("input-invalid");
    document.getElementById(`in-number-${window}`).classList.remove("input-invalid");
}


// Check if user is logged in
actualUser = localStorage.getItem("userName");
if (!actualUser || actualUser === '' ) {
  window.location.href = `login.html`;
}

/** This function sets the active navigation item to "Contacts".
 * It removes the active class from other navigation items and adds it to the contacts item.
*/
function activeNavItem() {
    document.getElementById('board').classList.remove('active');
    document.getElementById('contacts').classList.add('active');
    document.getElementById('addtask').classList.remove('active');
    document.getElementById('summary').classList.remove('active');
}

