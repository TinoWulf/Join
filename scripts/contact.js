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
            contactDiv.innerHTML += renderLetterHeader(alphabetArray[index]); // Render letter header

            for (let i = 0; i < usersCode.length; i++) { // Loop through all contacts
                let userID = usersCode[i]; // Get ID
                contactArray.push(userID); // Add to array
                let user = contactData.contacts[userID]; // Get user data

                if (user.name[0] == alphabetArray[index]) { // If name starts with current letter
                    let parts = user.name.split(" "); // Split name into words
                    let initials = "";
                    if (parts.length >= 2) { // If full name exists
                        initials = parts[0][0].toUpperCase() + parts[1][0].toUpperCase(); // Create initials
                    }
                    contactDiv.innerHTML += renderContactDiv(initials, colors[counter], user, userID, i); // Render contact div
                    triggerCounter(); // Update color counter
                }
            }
        }
        console.log(contactArray); // Debug contact array
    } catch (error) {
        console.error(error); // Log fetch error
    }
}

function triggerCounter() { // Increments color counter
    counter++;
    if (counter == 10) { // Reset after 10
        counter = 0;
    }
}

function showContact(initials, color, user, email, phone, userID, i) { // Show contact details
    if (activeContactIndex !== null) { // If another contact is active
        const oldActive = document.getElementById(`render-div${activeContactIndex}`); // Get old element
        if (oldActive) oldActive.classList.remove("render-div-hover"); // Remove highlight
    }
    document.getElementById(`render-div${i}`).classList.add("render-div-hover"); // Highlight current
    activeContactIndex = i; // Store active index
    document.getElementById("center").classList.add("display-show");
    let centerBody = document.getElementById("center-body"); // Get display area
    centerBody.innerHTML = renderContactInfo(initials, color, user, email, phone, userID); // Render contact info
}

function openContactAdd() { // Show add contact popup
    document.getElementById("popup-background").classList.remove("none");
    document.getElementById("popup-add").classList.remove("transform");
}

function closeContactAdd() { // Close add contact popup
    document.getElementById("popup-add").classList.add("transform");
    document.getElementById("popup-background").classList.add("none");
    document.getElementById("in-name-add").value = "";
    document.getElementById("in-email-add").value = "";
    document.getElementById("in-number-add").value = "";
}

function openEdit(initials, color, user, email, phone, userID) { // Open edit popup
    let popupEdit = document.getElementById("popup-edit");
    popupEdit.innerHTML = renderOpenEdit(color, initials, userID); // Set HTML content for edit popup
    document.getElementById("popup-edit").classList.remove("none"); // Show popup
    document.getElementById("in-name-edit").value = user; // Prefill inputs
    document.getElementById("in-email-edit").value = email;
    document.getElementById("in-number-edit").value = phone;
}

function closeEdit() { // Close edit popup
    document.getElementById("popup-edit").classList.add("none");
    document.getElementById("in-name-edit").value = ""; // Clear inputs
    document.getElementById("in-email-edit").value = "";
    document.getElementById("in-number-edit").value = "";
}

async function saveContact(userID) { // Save edited contact
    const name = document.getElementById("in-name-edit").value;
    const email = document.getElementById("in-email-edit").value;
    const number = document.getElementById("in-number-edit").value;
    const result = checkInput(name, email, number); // Validate input

    if (result) {
        await finishSaveContact(result, userID);
    }
}

async function addContact() { // Add new contact
    const name = document.getElementById("in-name-add").value;
    const email = document.getElementById("in-email-add").value;
    const number = document.getElementById("in-number-add").value;
    const result = checkInput(name, email, number); // Validate input
    let userID = Date.now() + getRandomID(100000); // Generate unique ID

    if (result) {
        await finishAddContact(result, userID);
    }
    clearInputs();
}

function checkInput(nameInput, emailInput, phoneInput) { // Validate input fields
    const nameParts = nameInput.trim().split(" "); // Split full name
    const digitsOnly = phoneInput.replace(/\D/g, ""); // Extract digits only
    if (nameParts.length < 2) {
        showAlertCheck("Please enter a full first and last name, with a blank line in between.");
        return null;
    }
    if (!emailInput.includes("@")) {
        showAlertCheck("Please enter a valid email address with @.");
        return null;
    }
    if (digitsOnly.length < 8 || digitsOnly.length > 13) {
        showAlertCheck("The phone number must contain between 8 and 13 digits.");
        return null;
    }
    const formattedName = nameParts.map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" "); // Format name
    const formattedPhone = digitsOnly.startsWith("0")
        ? "+49" + digitsOnly.slice(1)
        : "+49" + digitsOnly; // Format phone
    return { name: formattedName, email: emailInput, number: formattedPhone }; // Return validated data
}

function getRandomID(max) { // Generate a random unique ID
    let randomID;
    do {
        randomID = Math.floor(Math.random() * max);
    } while (contactArray.includes(randomID));
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
                </div>
                <div class="popup-field-email">
                    <input class="popup-field-email-input" type="email" placeholder="Email" id="in-email-edit">
                </div>
                <div class="popup-field-phone">
                    <input class="popup-field-phone-input" type="text" placeholder="Phone" id="in-number-edit">
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
    document.getElementById("popup-edit").classList.add("none"); // Close popup
    setTimeout(showAlert, 3000); // Show success alert and set timeout for 3 sekonds
    document.getElementById("alert").innerHTML = '<sub class="alert-text">Contact successfully saved</sub>';
    document.getElementById('alert').classList.toggle('alert-close');
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = ""; // Clear detail view
}

async function finishAddContact(result, userID) {
    await pushContact(result.name, result.email, result.number, userID); // Push to Firebase
    await fetchData(); // Refresh
    document.getElementById("popup-add").classList.add("transform");
    document.getElementById("popup-background").classList.add("none");
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
    document.getElementById("center").classList.remove("display-show");
}

function activeNavItem(){
  document.getElementById('board').classList.remove('active');
  document.getElementById('contacts').classList.add('active');
  document.getElementById('addtask').classList.remove('active');
  document.getElementById('summary').classList.remove('active');
}