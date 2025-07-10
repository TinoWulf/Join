const baseUrl = "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app"
let contactArray = [];
const alphabetArray = ["A", "B", "C", "D", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const colors = ["red","blue","green","orange","purple","brown","cyan","magenta","lime","gold"];
counter = 0;

async function fetchData() {
    let contactDiv = document.getElementById("contact-render");
    contactDiv.innerHTML = "";
    try {
        const response = await fetch(baseUrl + "/.json");
        const contactData = await response.json();
        const usersCode = Object.keys(contactData.contacts);
        for (let index = 0; index < alphabetArray.length; index++) {
            contactDiv.innerHTML += `<div class="render-div-splitter">
                                        <sub class="render-letter">${alphabetArray[index]}<sub>
                                     </div>
                                     <div class="render-letter-splitter"></div> `;
            for (let i = 0; i < usersCode.length; i++) {
                let userID = usersCode[i];
                let user = contactData.contacts[userID];
                if (user.name[0] == alphabetArray[index]) {
                    let parts = user.name.split(" ");
                    let initials = "";
                    if (parts.length >= 2) {
                        initials = parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
                    }
                    contactDiv.innerHTML += ` <div onclick="showContact('${initials}','${colors[counter]}','${user.name}','${user.email}','${user.phone}')" class="render-div">
                                        <div class="render-div-initals" style="background-color: ${colors[counter]};">
                                            <sub class="render-initals">${initials}</sub>
                                        </div>
                                        <div class="contact-info">
                                            <sub class="contact-name">${user.name}</sub>
                                            <sub class="contact-mail">${user.email}</sub>
                                        </div>
                                    </div>`;
                                    triggerCounter();
                                    console.log(contactData);
                                    
                }
            }
        }
    } catch (error) {
        console.error(error);
    }

}

function triggerCounter(){
    counter++;
    if (counter == 10) {
    counter = 0;        
    }
}

function showContact(initials, color, user, email, phone) {
    let centerBody = document.getElementById("center-body");
    centerBody.innerHTML = `<div class="center-top">
            <div class="center-top-inital-circle">
            <div class="center-top-inital-div" style="background-color: ${color};">
                <sub class="center-top-inital">${initials}</sub>
            </div>
            </div>
            <div class="center-top-second-div">
                <div class="center-top-name">${user}</div>
                <div class="center-top-edit">
                    <div class="edit">
                        <img src="./assets/icons/edit.png" alt="">
                        <sub class="edit-sub">Edit</sub>
                    </div>
                    <div class="delete">
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
        </div>`;
}

function addContact() {
    document.getElementById("popup").classList.remove("none");
}

function closePopup() {
    document.getElementById("popup").classList.add("none");
}


