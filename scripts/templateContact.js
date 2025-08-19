
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