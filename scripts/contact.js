const baseUrl = "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app" // Firebase base URL
let contactArray = []; // Stores all contact IDs
const alphabetArray = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"] // Letters used to sort contacts
const colors = ["red", "blue", "green", "orange", "purple", "brown", "cyan", "magenta", "lime", "gold"]; // Color options for contact initials
let counter = 0; // Color counter
let activeContactIndex = null; // Currently selected contact index

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


function triggerCounter() { // Increments color counter
    counter++;
    if (counter == 10) { // Reset after 10
        counter = 0; // Reset color counter
    }
}

function showContact(initials, color, user, email, phone, userID, i) { // Show contact details
    if (activeContactIndex !== null) { // If another contact is active
        const oldActive = document.getElementById(`render-div${activeContactIndex}`); // Get old element
        if (oldActive) oldActive.classList.remove("render-div-hover"); // Remove highlight
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

function openContactAdd() { // Show add contact popup
    document.getElementById("popup-add").classList.remove("slide-out");
    document.getElementById("popup-background").style.display = "flex";
    document.getElementById("popup-add").style.display = "flex";
    document.getElementById("popup-add").classList.add("slide-in"); // Show popup with slide-in animation
}

function closeContactAdd() { // Close add contact popup
    document.getElementById("popup-add").classList.remove("slide-in");
    document.getElementById("popup-add").classList.add("slide-out");
    document.getElementById("popup-background").style.display = "none";
    clearInputs(); // Clear input fields
    document.getElementById("invalid-name-add").style.display = "none"; // Hide error messages
    document.getElementById("invalid-email-add").style.display = "none";
    document.getElementById("invalid-phone-add").style.display = "none";
    document.getElementById("in-name-add").classList.remove("input-invalid"); // Remove invalid input styles
    document.getElementById("in-email-add").classList.remove("input-invalid");
    document.getElementById("in-number-add").classList.remove("input-invalid");
}

function openEdit(initials, color, user, email, phone, userID) { // Open edit popup
    let popupEdit = document.getElementById("popup-edit");
    popupEdit.innerHTML = renderOpenEdit(color, initials, userID);// Set HTML content for edit popup
    document.getElementById("popup-edit").classList.remove("slide-out");
    document.getElementById("popup-background").style.display = "flex";
    document.getElementById("popup-edit").style.display = "flex";
    document.getElementById("popup-edit").classList.add("slide-in");
    document.getElementById("in-name-edit").value = user; // Prefill inputs
    document.getElementById("in-email-edit").value = email;
    document.getElementById("in-number-edit").value = phone;
}

function closeEdit() { // Close edit popup
    document.getElementById("popup-edit").classList.remove("slide-in");
    document.getElementById("popup-edit").classList.add("slide-out");
    document.getElementById("popup-background").style.display = "none";
    document.getElementById("in-name-edit").value = ""; // Clear inputs
    document.getElementById("in-email-edit").value = "";
    document.getElementById("in-number-edit").value = "";
}

async function saveContact(userID) { // Save edited contact
    const name = document.getElementById("in-name-edit").value;
    const email = document.getElementById("in-email-edit").value;
    const number = document.getElementById("in-number-edit").value;
    const result = checkInput(name, email, number, "edit"); // Validate input

    if (result) {
        await finishSaveContact(result, userID);
    }
}

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

function checkInput(nameInput, emailInput, phoneInput, int) {
    const nameParts = nameInput.trim().split(" "); // Split name into parts
    const digitsOnly = phoneInput.replace(/\D/g, ""); // Remove non-digit characters from phone
    const nameField = document.getElementById(`in-name-${int}`); // Get input fields
    const emailField = document.getElementById(`in-email-${int}`); // Get email input field
    const phoneField = document.getElementById(`in-number-${int}`); // Get phone input field
    const nameError = document.getElementById(`invalid-name-${int}`); // Get error elements
    const emailError = document.getElementById(`invalid-email-${int}`);
    const phoneError = document.getElementById(`invalid-phone-${int}`);
    let valid = true; // Flag to track validation
    if (!validateName(nameParts, nameField, nameError)) valid = false; // Validate name
    if (!validateEmail(emailInput, emailField, emailError, int)) valid = false; // Validate email
    if (!validatePhone(digitsOnly, phoneField, phoneError, int)) valid = false; // Validate phone number
    if (!valid) return null; // If any validation failed, return null
    const formattedName = nameParts // Format name to have first letter uppercase and rest lowercase
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitalize each part of the name
        .join(" "); // Join parts back into a full name
    const formattedPhone = digitsOnly.startsWith("0") // Format phone number to start with +49
        ? "+49" + digitsOnly.slice(1) // Remove leading zero if present
        : "+49" + digitsOnly; // Add +49 prefix to phone number
    return { // Return validated and formatted contact data
        name: formattedName,
        email: emailInput,
        number: formattedPhone
    };
}

function validateName(nameParts, inputField, errorElement) {
    if (nameParts.length < 2) { // Check if name has at least first and last name
        errorElement.style.display = "block";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.style.display = "none";
        inputField.classList.remove("input-invalid");
        return true;
    }
}

function validateEmail(email, inputField, errorElement) {
    if (!email.includes("@") || !email.includes(".") || email.length < 6) { // Check if email is valid
        errorElement.style.display = "block";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.style.display = "none";
        inputField.classList.remove("input-invalid");
        return true;
    }
}

function validatePhone(phoneDigits, inputField, errorElement) {
    if (phoneDigits.length < 8 || phoneDigits.length > 13) { // Check if phone number has valid length
        errorElement.style.display = "block";
        inputField.classList.add("input-invalid");
        return false;
    } else {
        errorElement.style.display = "none";
        inputField.classList.remove("input-invalid");
        return true;
    }
}

function getRandomID(max) { // Generate a random unique ID
    let randomID;
    do {
        randomID = Math.floor(Math.random() * max); // Generate random number
    } while (contactArray.includes(randomID)); // Ensure it's not already in contactArray
    return randomID;
}

async function pushContact(name, email, number, userID) { // Save contact in Firebase
    try {
        const contact = { id: userID, name: name, email: email, phone: number };
        const contactId = contact.id;
        const response = await fetch(`${baseUrl}/contacts/${contactId}.json`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contact)
        });
        if (!response.ok) {
            throw new Error(`Error writing contact ${contactId}`);
        }
    } catch (error) {
        console.error("Error pushing contact:", error);
        alert("Error adding contact");
    }
}

async function deleteContact(userID) { // Delete contact from Firebase
    try {
        const response = await fetch(`${baseUrl}/contacts/${userID}.json`, {
            method: "DELETE"
        });
        await fetchData(); // Refresh
        finishDelete();
    } catch (error) {
        console.error("Error deleting contact:", error);
        alert("Error deleting contact");
    }
}

function showAlert() { // Toggle alert popup visibility
    document.getElementById('alert').classList.toggle('alert-close');
}

function renderLetterHeader(alphabetArray) {
    return `<div class="render-div-splitter">
                <sub class="render-letter">${alphabetArray}<sub>
            </div>
            <div class="render-letter-splitter"></div> `
}

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

function renderContactInfo(initials, color, user, email, phone, userID) {
    return `<div class="center-top">
            <div class="center-top-inital-circle">
            <div class="center-top-inital-div" style="background-color: ${color};">
                <sub class="center-top-inital">${initials}</sub>
            </div>
            </div>
            <div class="center-top-second-div">
                <div class="center-top-name">${user}</div>
                <div class="center-top-edit">
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

function renderOpenEdit(color, initials, userID) {
    return `<div class="popup-main">
            <div class="popup-banner">
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

async function finishAddContact(result, userID) {
    await pushContact(result.name, result.email, result.number, userID); // Push to Firebase
    await fetchData(); // Refresh
    closeContactAdd(); // Close add popup
    setTimeout(showAlert, 3000);
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully created</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = "";

}

function finishDelete() {
    document.getElementById("popup-edit").classList.add("none"); // Close popup
    setTimeout(showAlert, 3000);
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully deleted</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = "";
}

function showAlertCheck(message) {
    setTimeout(showAlert, 5000);
    let alert = document.getElementById("alert");
    alert.innerHTML = `<sub class="alert-text">${message}</sub>`;
    alert.classList.add("alert");
    document.getElementById('alert').classList.toggle('alert-close');
}

function clearInputs() {
    document.getElementById("in-name-add").value = ""; // Clear inputs
    document.getElementById("in-email-add").value = "";
    document.getElementById("in-number-add").value = "";
}

function closeResponsivContact() {
    let popup = document.getElementById("center");
    popup.classList.remove("center"); // Remove slide-in animation
    popup.classList.add("center-out"); // Add slide-out animation
}

function showResponsivContact() {
    document.getElementById("center").classList.remove("center-out"); // Remove slide-out animation
    document.getElementById("center").classList.add("center");
    document.getElementById("center").style.display = "block";
}

function activeNavItem() {
    document.getElementById('board').classList.remove('active');
    document.getElementById('contacts').classList.add('active');
    document.getElementById('addtask').classList.remove('active');
    document.getElementById('summary').classList.remove('active');
}


let actualUser = localStorage.getItem("userName");
if (actualUser == 'nouser' ) {
  window.location.href = `login.html`;
} else if( actualUser && actualUser !== 'null') {
  document.getElementById('initial-user').textContent = getAbbreviation(actualUser);
  document.getElementById('greetMessage').textContent = getUserExits(currentHour);
  document.getElementById('userName').textContent = actualUser;
}else{
  document.getElementById('initial-user').textContent = 'G';
  document.getElementById('greetMessage').textContent = getGuestUser(currentHour);
}