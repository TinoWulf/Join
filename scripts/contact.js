const baseUrl = "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app" // Firebase base URL
let contactArray = []; // Stores all contact IDs
const alphabetArray = ["A", "B", "C", "D","E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] // Letters used to sort contacts
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
        initializeContactArray(usersCode, contactArray, contactDiv, counter, contactData); // Initialize contact array with IDs
        activeNavItem();
    } catch (error) {
        console.error(error); // Log fetch error
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
    document.getElementById("in-number-edit").value = phone.replace(/^(\+49|49)/, ""); // Remove +49 or 49 prefix for editing
    clearValidationMessages("edit"); // Clear any previous validation messages
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
    const { nameParts, nameField, emailField, phoneField, nameError, emailError, phoneError } 
     = getValidationElements(int, nameInput, phoneInput); // Get validation elements based on input type
    let valid = true; // Flag to track validation
    if (!validateName(nameParts, nameField, nameError, nameInput)) valid = false; // Validate name
    if (!validateEmail(emailInput, emailField, emailError, int)) valid = false; // Validate email
    if (!validatePhone(phoneInput, phoneField, phoneError, int)) valid = false; // Validate phone number
    if (!valid) return null; // If any validation failed, return null
    const formattedName = getFormattedName(nameParts); // Format name
    const formattedPhone = getFormattedPhone(phoneInput); // Format phone number
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
function validateName(nameParts, inputField, errorElement, nameInput) {
    if (nameParts.length < 2) { // Check if name has at least first and last name
        errorElement.innerHTML = "Invalid name, please enter a full first and last name.";
        inputField.classList.add("input-invalid");
        return false;}
    else if (/\d/.test(nameInput)) { // Check if name contains digits
        errorElement.innerHTML = "Name cannot contain digits.";
        inputField.classList.add("input-invalid");
        return false;}
    else {
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
function validatePhone(phoneDigits, inputField, errorElement,) {
    if (phoneDigits.length < 8 || phoneDigits.length > 13) { // Check if phone number has valid length
        errorElement.innerHTML = "The phone number must contain between 8 and 13 digits.";
        inputField.classList.add("input-invalid");
        return false;
    }
    else if (/[a-zA-Z]/.test(phoneDigits)) { // Check if phone number contains letters
        errorElement.innerHTML = "Your number cannot contain letters.";
        inputField.classList.add("input-invalid");
        return false;}
    else {
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
async function deleteContact(userID, hide) { // Delete contact from Firebase
    try {
        const response = await fetch(`${baseUrl}/contacts/${userID}.json`, { // Send DELETE request
            method: "DELETE" // Delete contact by userID
        });
        await fetchData(); // Refresh
        finishDelete(hide); // Close edit popup
    } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Error deleting contact");
    }
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
    const nameField = document.getElementById(`in-name-${int}`); // Get input fields
    const emailField = document.getElementById(`in-email-${int}`);
    const phoneField = document.getElementById(`in-number-${int}`);
    const nameError = document.getElementById(`invalid-name-${int}`); // Get error elements
    const emailError = document.getElementById(`invalid-email-${int}`);
    const phoneError = document.getElementById(`invalid-phone-${int}`);
    return { nameParts, nameField, emailField, phoneField, nameError, emailError, phoneError };
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


/** This function initializes the contact array by looping through each letter of the alphabet.
 * It checks if any contacts match the current letter and renders them accordingly.
 * It updates the contactDiv with the rendered contacts for each letter.
*/
function initializeContactArray(usersCode, contactArray, contactDiv, counter, contactData) {
    for (let index = 0; index < alphabetArray.length; index++) { // Loop through each letter in the alphabet
        let currentLetter = alphabetArray[index]; // Get current letter
        let letterHasMatch = false; // Flag to check if any contact matches the current letter
        let tempHTML = ""; // Temporary HTML to store contacts for the current letter
        let result = initializeContactArrayForLetter(usersCode, contactData, currentLetter, contactArray, counter, letterHasMatch, tempHTML); // Initialize contact array for the current letter
        counter = result.counter; // Update counter
            if (result.letterHasMatch) { // If there are contacts for the current letter
                contactDiv.innerHTML += renderLetterHeader(currentLetter); // Render letter header
                contactDiv.innerHTML += result.tempHTML; // Append contacts for the current letter
            }
    }
}


/** * This function initializes the contact array for a specific letter.
 * It loops through each user ID, checks if the first letter of the user's name matches the current letter,
 * and if so, adds the user ID to the contactArray and renders the contact div.
*/
function initializeContactArrayForLetter(usersCode, contactData, currentLetter, contactArray, counter, letterHasMatch, tempHTML) {
    for (let i = 0; i < usersCode.length; i++) { // Loop through each user ID
        let userID = usersCode[i]; // Get user ID
        let user = contactData.contacts[userID]; // Get user data from contactData
        if (user.name[0].toUpperCase() === currentLetter) { // Check if the first letter matches the current letter
            contactArray.push(userID); // Add user ID to contactArray
            let parts = user.name.split(" "); // Split name into parts
            let initials = parts.length >= 2 // If name has first and last name, use initials from both
                ? parts[0][0].toUpperCase() + parts[1][0].toUpperCase() // Use first letter of first and last name
                : parts[0][0].toUpperCase(); // Use first letter of first name only
            tempHTML += renderContactDiv(initials, colors[counter], user, userID, i); // Render contact div
            counter = triggerCounter();  // wichtig: neuen Counter zurückholen
            letterHasMatch = true;}} // If the first letter matches, add to contactArray and render contact div
    return { contactArray, tempHTML, letterHasMatch, counter };
}