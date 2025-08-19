const baseUrl = "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app" // Firebase base URL
let contactArray = []; // Stores all contact IDs
const alphabetArray = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] // Letters used to sort contacts
const colors = ["red", "blue", "green", "orange", "purple", "brown", "cyan", "magenta", "lime", "gold"]; // Color options for contact initials
let counter = 0; // Color counter
let activeContactIndex = null; // Currently selected contact index


/**
 * This function fetches all contacts from Firebase, sorts them alphabetically,
 * and renders them grouped by the first letter of their name.
 * Variables used: baseUrl, contactArray, alphabetArray, colors, counter
 */
async function fetchData() { // Loads and displays contacts from Firebase
    contactArray = []; // Reset contact array
    counter = 0; // Reset color counter
    let contactDiv = document.getElementById("contact-render"); // Get container for rendering contacts
    contactDiv.innerHTML = ""; // Clear old content

    try {
        const response = await fetch(baseUrl + "/.json"); // Fetch all data from Firebase
        const contactData = await response.json(); // Parse JSON response
        const usersCode = Object.keys(contactData.contacts); // Get list of contact IDs
        for (let index = 0; index < alphabetArray.length; index++) { // Loop through A-Z
            let currentLetter = alphabetArray[index]; // Get current letter
            let letterHasMatch = false; // Flag to track if a contact matches this letter
            let tempHTML = ""; // Temporary container for rendered contacts
            for (let i = 0; i < usersCode.length; i++) { // Loop through contacts
                let userID = usersCode[i]; // Get contact ID
                let user = contactData.contacts[userID]; // Get contact data
                if (user.name[0].toUpperCase() === currentLetter) { // Check if contact starts with current letter
                    contactArray.push(userID); // Add to contact array
                    let parts = user.name.split(" "); // Split name into parts
                    let initials = ""; // Initialize initials
                    if (parts.length >= 2) { // If full name is available
                        initials = parts[0][0].toUpperCase() + parts[1][0].toUpperCase(); // Create initials from first letters of first and last name
                    }
                    tempHTML += renderContactDiv(initials, colors[counter], user, userID, i); // Build contact HTML
                    triggerCounter(); // Increment color counter
                    letterHasMatch = true; // Set flag if a contact matched
                }
            }
            if (letterHasMatch) { // If there are contacts for this letter
                contactDiv.innerHTML += renderLetterHeader(currentLetter); // Only render letter header if match
                contactDiv.innerHTML += tempHTML; // Append contacts for this letter
            }
        }
    } catch (error) {
        console.error(error); // Log fetch error
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


/**
 * This function displays the selected contact's details in the contact info area
 * and highlights the active contact in the list.
 * Variables used: activeContactIndex
 */
function showContact(initials, color, user, email, phone, userID, i) { // Show contact details
    if (activeContactIndex !== null) {
        RemoveActiveContact(activeContactIndex); // Remove highlight from previous contact
    }
    document.getElementById(`render-div${i}`).classList.add("render-div-hover"); // Highlight current
    activeContactIndex = i; // Store active index
    if (window.matchMedia("(max-width: 876px)").matches) {
        showResponsivContact(); // If on mobile, show responsive contact view
    }
    let centerBody = document.getElementById("center-body"); // Get display area
    centerBody.innerHTML = renderContactInfo(initials, color, user, email, phone, userID); // Render contact info
    centerBody.classList.remove("slide-in"); // Set back slide-in animation
    void centerBody.offsetWidth; // Force reflow 
    centerBody.classList.add("slide-in"); // Add class again
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
    clearInputs(); // Clear input fields
    document.getElementById("invalid-name-add").style.display = "none"; // Hide error messages
    document.getElementById("invalid-email-add").style.display = "none";
    document.getElementById("invalid-phone-add").style.display = "none";
    document.getElementById("in-name-add").classList.remove("input-invalid"); // Remove invalid input styles
    document.getElementById("in-email-add").classList.remove("input-invalid");
    document.getElementById("in-number-add").classList.remove("input-invalid");
}


/** This function opens the edit contact popup, pre-filling it with the contact's details.
 * It sets the popup to be visible and applies the slide-in animation.
 * It also sets the background to be displayed as a flex container.
 * The contact's name, email, and phone number are pre-filled in the input fields.
*/
function openEdit(initials, color, user, email, phone, userID) { // Open edit popup
    closeResponsivContact(); // Close responsive contact view if open
    let popupEdit = document.getElementById("popup-edit"); // Get edit popup element
    popupEdit.innerHTML = renderOpenEdit(color, initials, userID);// Set HTML content for edit popup
    popupEdit.classList.remove("slide-out"); 
    document.getElementById("popup-background").style.display = "flex";
    popupEdit.style.display = "flex"; 
    popupEdit.classList.add("slide-in");
    document.getElementById("in-name-edit").value = user; // Prefill inputs
    document.getElementById("in-email-edit").value = email;
    document.getElementById("in-number-edit").value = phone;
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
    document.getElementById("in-name-edit").value = ""; // Clear inputs
    document.getElementById("in-email-edit").value = "";
    document.getElementById("in-number-edit").value = "";
}


/** This function saves the edited contact details.
 * It retrieves the values from the input fields, validates them,
 * and if valid, calls the function to save the contact.
 * It uses the userID to identify which contact to update.
 * If the input is valid, it calls finishSaveContact to save the changes.
*/
async function saveContact(userID) { // Save edited contact
    const name = document.getElementById("in-name-edit").value;
    const email = document.getElementById("in-email-edit").value;
    const number = document.getElementById("in-number-edit").value;
    const result = checkInput(name, email, number, "edit"); // Validate input

    if (result) {
        await finishSaveContact(result, userID); // Save contact
    }
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
        clearInputs(); // Clear input fields
    }
}


/** This function checks the input fields for validity.
 * It validates the name, email, and phone number fields.
 * If any validation fails, it returns null.
 * If all validations pass, it formats the name and phone number,
 * and returns an object with the validated contact data.
 * It ensures the name has at least a first and last name,
 * the email is valid, and the phone number has a valid length.
 * It formats the name to have the first letter uppercase and the rest lowercase,
 * and formats the phone number to start with +49.
*/
function checkInput(nameInput, emailInput, phoneInput, int) {
    const { nameParts, digitsOnly, nameField, emailField, phoneField, nameError, emailError, phoneError } 
     = getValidationElements(int, nameInput, phoneInput); // Get validation elements based on input type
    let valid = true; // Flag to track validation
    if (!validateName(nameParts, nameField, nameError)) valid = false; // Validate name
    if (!validateEmail(emailInput, emailField, emailError, int)) valid = false; // Validate email
    if (!validatePhone(digitsOnly, phoneField, phoneError, int)) valid = false; // Validate phone number
    if (!valid) return null; // If any validation failed, return null
    const formattedName = getFormattedName(nameParts); // Format name
    const formattedPhone = getFormattedPhone(digitsOnly); // Format phone number
    return { // Return validated and formatted contact data
        name: formattedName,
        email: emailInput,
        number: formattedPhone 
    };
}


/** This function validates the name input.
 * It checks if the name has at least a first and last name.
 * If not, it displays an error message and adds an invalid class to the input field.
 * If valid, it hides the error message and removes the invalid class.
 * It ensures the name input is properly formatted with at least two parts.
*/
function validateName(nameParts, inputField, errorElement) {
    if (nameParts.length < 2) { // Check if name has at least first and last name
        errorElement.innerHTML = "Invalid name, please enter a full first and last name.";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.innerHTML = "";
        inputField.classList.remove("input-invalid");
        return true;
    }
}


/** This function validates the email input.
 * It checks if the email contains "@" and "." and has a minimum length.
 * If not, it displays an error message and adds an invalid class to the input field.
 * If valid, it hides the error message and removes the invalid class.
 * It ensures the email input is properly formatted with at least 6 characters.
*/
function validateEmail(email, inputField, errorElement) {
    if (!email.includes("@") || !email.includes(".") || email.length < 6) { // Check if email is valid
        errorElement.innerHTML = "Please enter a valid email address.";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.innerHTML = "";
        inputField.classList.remove("input-invalid");
        return true;
    }
}


/** This function validates the phone number input.
 * It checks if the phone number has a valid length (between 8 and 13 digits).
 * If not, it displays an error message and adds an invalid class to the input field.
 * If valid, it hides the error message and removes the invalid class.
 * It ensures the phone number input is properly formatted with a length between 8 and 13 digits.
*/
function validatePhone(phoneDigits, inputField, errorElement) {
    if (phoneDigits.length < 8 || phoneDigits.length > 13) { // Check if phone number has valid length
        errorElement.innerHTML = "The phone number must contain between 8 and 13 digits.";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.innerHTML = "";
        inputField.classList.remove("input-invalid");
        return true;
    }
}


/** This function generates a random unique ID for a new contact.
 * It ensures the ID is not already in use by checking against the contactArray.
 * It generates a random number between 0 and max (exclusive) until it finds a unique ID.
 * It returns the unique ID.
*/
function getRandomID(max) { // Generate a random unique ID
    let randomID;
    do {
        randomID = Math.floor(Math.random() * max); // Generate random number
    } while (contactArray.includes(randomID)); // Ensure it's not already in contactArray
    return randomID;
}


/** This function pushes a new contact to Firebase.
 * It creates a contact object with the provided name, email, phone number, and userID.
 * It sends a PUT request to Firebase to save the contact.
 * If the request fails, it logs an error and alerts the user.
 * It ensures the contact is saved in Firebase with the correct structure.
*/
async function pushContact(name, email, number, userID) { // Save contact in Firebase
    try {
        const contact = { id: userID, name: name, email: email, phone: number }; // Create contact object
        const contactId = contact.id; // Get contact ID
        const response = await fetch(`${baseUrl}/contacts/${contactId}.json`, { // Send PUT request to Firebase
            method: "PUT", // Use PUT to update or create contact
            headers: { "Content-Type": "application/json" }, // Set content type
            body: JSON.stringify(contact) // Convert contact object to JSON string
        });
        if (!response.ok) {
            throw new Error(`Error writing contact ${contactId}`);
        }
    } catch (error) {
        console.error("Error pushing contact:", error);
        alert("Error adding contact");
    }
}


/** This function deletes a contact from Firebase.
 * It sends a DELETE request to Firebase using the userID.
 * If the request fails, it logs an error and alerts the user.
 * After deletion, it refreshes the contact list and shows a success alert.
 * It ensures the contact is removed from Firebase and the UI is updated accordingly.
*/
async function deleteContact(userID) { // Delete contact from Firebase
    try {
        const response = await fetch(`${baseUrl}/contacts/${userID}.json`, { // Send DELETE request
            method: "DELETE" // Delete contact by userID
        });
        await fetchData(); // Refresh
        finishDelete(); // Close edit popup
    } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Error deleting contact");
    }
}


/** This function toggles the visibility of the alert popup.
*/
function showAlert() { // Toggle alert popup visibility
    document.getElementById('alert').classList.toggle('alert-close');
}


/** This function renders the letter header for contact groups.
 * It creates a div with the letter and a splitter for styling.
*/
function renderLetterHeader(alphabetArray) {
    return `<div class="render-div-splitter">
                <sub class="render-letter">${alphabetArray}<sub>
            </div>
            <div class="render-letter-splitter"></div> `
}


/**
 * This function returns the HTML for a single contact item in the contact list.
 * It includes the initials, name, and email of the contact.
 * It is used to render each contact in the contact list.
*/
function renderContactDiv(initials, color, user, userID, i) {
    return ` <div id="render-div${i}" onclick="showContact('${initials}','${color}','${user.name}','${user.email}','${user.phone}',${userID},${i})" class="render-div">
                <div class="render-div-initals" style="background-color: ${colors[counter]};">
                    <sub class="render-initals">${initials}</sub>
                </div>
                <div class="contact-info">
                    <sub class="contact-name">${user.name}</sub>
                    <sub class="contact-mail">${user.email}</sub>
                </div>
            </div>`
}


/**
 * This function returns the HTML for the detailed contact info display.
 * and highlights the active contact in the list.
 * It is used to show the contact details when a contact is selected, and
 * includes the initials, name, email, and phone number of the contact.
*/
function renderContactInfo(initials, color, user, email, phone, userID) {
    return `<div class="center-top">
            <div class="center-top-inital-circle">
            <div class="center-top-inital-div" style="background-color: ${color};">
                <sub class="center-top-inital">${initials}</sub>
            </div>
            </div>
            <div class="center-top-second-div">
                <div class="center-top-name">${user}</div>
                <div id="center-top-edit" class="center-top-edit">
                    <div onclick="openEdit('${initials}','${color}','${user}','${email}','${phone}',${userID})" class="edit">
                        <img src="./assets/icons/edit.png" alt="">
                        <sub class="edit-sub">Edit</sub>
                    </div>
                    <div onclick="deleteContact(${userID})" class="delete">
                        <img src="./assets/icons/delete.png" alt="">
                        <sub class="delete-sub">Delete</sub>
                    </div>
                </div>
            </div>
        </div>
        <div class="center-middle">
            <sub class="center-middle-text">Contact Information</sub>
        </div>
        <div class="center-bottom">
            <div class="center-bottom-mail">
                <sub class="center-bottom-mail-text">Email</sub>
                <sub class="center-bottom-mail-name">${email}</sub>
            </div>
            <div class="center-bottom-number">
                <sub class="center-bottom-phone-text">Phone</sub>
                <sub class="center-bottom-phone-number">${phone}</sub>
            </div>
        </div>`
}


/** This function returns the HTML for the edit contact popup.
 * It includes fields for name, email, and phone number,
 * and buttons to save or delete the contact.
 * It is used to render the edit contact popup with pre-filled values.
*/
function renderOpenEdit(color, initials, userID) {
    return `<div class="popup-main">
            <div class="popup-banner">
                <div onclick="closeEdit()" class="popup-close-btn-img-white">
                        <img src="./assets/icons/close_white.png" alt="">
                    </div>
                <div class="popup-banner-join">
                    <img class="popup-banner-join-logo" src="./assets/img/logo.png" alt="">
                </div>
                <div class="popup-banner-join-text">
                    <sub class="popup-banner-sub1">Edit contact</sub>
                </div>
                <div class="popup-banner-vector"></div>
            </div>

            <div class="popup-close-btn-div">
                <div  onclick="closeEdit()" class="popup-close-btn">
                    <img src="./assets/icons/iconoir_cancel.png" alt="">
                </div>
            </div>
            <div class="popup-contact-div" style="background-color: ${color};">
                <sub class="center-top-inital">${initials}</sub>
            </div>
            <div class="popup-field">
                <div class="popup-field-name">
                    <input class="popup-field-name-input" type="name" placeholder="Name" id="in-name-edit">
                    <sub class="popup-field-invalid-sub" id="invalid-name-edit"> Invalid name, please enter a full first and last name.</sub>
                </div>
                <div class="popup-field-email">
                    <input class="popup-field-email-input" type="email" placeholder="Email" id="in-email-edit">
                    <sub class="popup-field-invalid-sub" id="invalid-email-edit"> Please enter a valid email address.</sub>
                </div>
                <div class="popup-field-phone">
                    <input class="popup-field-phone-input" type="text" placeholder="Phone" id="in-number-edit">
                    <sub class="popup-field-invalid-sub" id="invalid-phone-edit"> The phone number must contain between 8 and 13 digits.</sub>
                </div>
            </div>
            <div class="popup-buttons">
                <button onclick="deleteContact(${userID})" class="popup-btn-cancel">Delete</button>
                <button onclick="saveContact(${userID})" class="popup-btn-save">Save <img src="./assets/icons/check.png" alt=""></button>
            </div>
        </div>`
}


/** This function handles the completion of saving a contact.
 * It pushes the contact data to Firebase, refreshes the contact list,
 * closes the edit popup, and shows a success alert.
 * It ensures the contact is saved in Firebase and the UI is updated accordingly.
*/
async function finishSaveContact(result, userID) {
    await pushContact(result.name, result.email, result.number, userID); // Save to Firebase
    await fetchData(); // Refresh contact list
    closeEdit(); // Close edit popup
    setTimeout(showAlert, 3000); // Show success alert and set timeout for 3 sekonds
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully saved</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = ""; // Clear detail view
}


/** This function handles the completion of adding a new contact.
 * It pushes the contact data to Firebase, refreshes the contact list,
 * closes the add popup, and shows a success alert.
 * It ensures the new contact is saved in Firebase and the UI is updated accordingly.
*/
async function finishAddContact(result, userID) {
    await pushContact(result.name, result.email, result.number, userID); // Push to Firebase
    await fetchData(); // Refresh
    closeContactAdd(); // Close add popup
    setTimeout(showAlert, 3000); // Show success alert and set timeout for 3 seconds
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully created</sub>'; // Set alert message
    document.getElementById('alert').classList.toggle('alert-close'); // Toggle alert visibility
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = ""; // Clear center body content
}


/** This function handles the completion of deleting a contact.
 * It closes the edit popup, shows a success alert,
 * and clears the contact detail view.
 * It ensures the contact is removed from the UI and the user is informed of the successful deletion.
*/
function finishDelete() {
    document.getElementById("popup-edit").classList.add("none"); // Close popup
    setTimeout(showAlert, 3000);
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully deleted</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = "";
}


/** This function shows an alert message after actions like saving or deleting contacts.
 * It sets a timeout to automatically hide the alert after 5 seconds.
 * It updates the alert message with the provided text and toggles the alert class to show it and
 * ensures the alert is displayed for a brief period after actions like saving or deleting contacts.
*/
function showAlertCheck(message) {
    setTimeout(showAlert, 5000);
    let alert = document.getElementById("alert");
    alert.innerHTML = `<sub class="alert-text">${message}</sub>`;
    alert.classList.add("alert");
    document.getElementById('alert').classList.toggle('alert-close');
}


/** This function clears the input fields in the add contact popup.
 * It resets the values of the name, email, and phone number inputs to empty strings.
*/
function clearInputs() {
    document.getElementById("in-name-add").value = ""; // Clear inputs
    document.getElementById("in-email-add").value = "";
    document.getElementById("in-number-add").value = "";
}


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


/** This function sets the active navigation item to "Contacts".
 * It removes the active class from other navigation items and adds it to the contacts item.
*/
function activeNavItem() {
    document.getElementById('board').classList.remove('active');
    document.getElementById('contacts').classList.add('active');
    document.getElementById('addtask').classList.remove('active');
    document.getElementById('summary').classList.remove('active');
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


/** This function removes the highlight from the previously active contact.
 * It gets the old active contact element by its index and removes the highlight class.
*/
function RemoveActiveContact(activeContactIndex) {
    const oldActive = document.getElementById(`render-div${activeContactIndex}`); // Get old element
        if (oldActive) oldActive.classList.remove("render-div-hover"); // Remove highlight
}


/** This function initializes the contact page by fetching data and setting the active navigation item.
 * It calls fetchData to load contacts and activeNavItem to set the active navigation item.
*/
function getValidationElements(int, nameInput, phoneInput) {
    const nameParts = nameInput.trim().split(" "); // Split name into parts
    const digitsOnly = phoneInput.replace(/\D/g, ""); // Remove non-digit characters from phone
    const nameField = document.getElementById(`in-name-${int}`); // Get input fields
    const emailField = document.getElementById(`in-email-${int}`);
    const phoneField = document.getElementById(`in-number-${int}`);
    const nameError = document.getElementById(`invalid-name-${int}`); // Get error elements
    const emailError = document.getElementById(`invalid-email-${int}`);
    const phoneError = document.getElementById(`invalid-phone-${int}`);
    return { nameParts, digitsOnly, nameField, emailField, phoneField, nameError, emailError, phoneError };
}


/** This function formats the name by capitalizing the first letter of each part.
 * It takes an array of name parts, capitalizes the first letter of each part,
*/
function getFormattedName(nameParts) {
    return nameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" "); // Format name
}


/** This function formats the phone number to start with +49.
 * It checks if the phone number starts with 0 and replaces it with +49.
*/
function getFormattedPhone(digitsOnly) {
    return digitsOnly.startsWith("0") ? "+49" + digitsOnly.slice(1) : "+49" + digitsOnly; // Format phone number
}

// Check if user is logged in
let actualUser = localStorage.getItem("userName");
if (actualUser == 'nouser') { // If no user is logged in, redirect to login page
    window.location.href = `login.html`; // Redirect to login page
}