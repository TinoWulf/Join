import { initiateBoard } from "./board.js";
import {ref, update,get,  database} from "./connection.js";
const dataBaseURL =
  "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let alreadyAssigned = [];
let subtasklistItem = [];
let contactListGlobal = [];
let contactIdList = [];
let alreadyAssignedContainer = document.getElementById("alreadyAssigned");
let subtaskListEdit = document.getElementById("subtaskListEdit");


/**
 * get all contacts from database, already asigned for this task.
 * if there are no contacts, the functioin create a empty array.
 * @param {number} taskId task id
 */
async function getAlreadyAssigned(taskId) {
    try {
        const assignedRef = ref(database, `tasks/${taskId}`);
        const snapshot = await get(assignedRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            alreadyAssigned = data.assignedTo;
        } else {
            alreadyAssigned = [];
        }
    } catch (error) {
        openErrorPage();
    }
}


/**
 * Fetches contacts from the database, updates the contact list, 
 * renders each contact on the board, and applies color styling to assigned elements.
 * 
 * @async
 * @function fetchContacts
 * @returns {Promise<void>} Resolves when contacts are fetched and rendered.
 */
async function fetchContacts(taskId) {
    await getAlreadyAssigned(taskId);
    let contactBoard = document.getElementById("assigned");
    contactBoard.innerHTML = ""; 
  const response = await fetch(dataBaseURL + "/.json"); 
  const contactData = await response.json(); 
  contactIdList = Object.keys(contactData.contacts);
  contactListGlobal = [];
  for(let index=0; index <contactIdList.length; index++){
    let contactID = contactIdList[index];
    let contact = contactData.contacts[contactID];
    const contactIsAssignedToTask = !!alreadyAssigned?.find(t => t.name == contact.name);
    contactListGlobal.push(contact);
    contactBoard.innerHTML += templateRenderContactOnBord(contact, contactIsAssignedToTask);
    applyAssignedToColorSpan();
  }
}


/**
 * @async
 * Renders a contact list for the task board.
 */
async function getUser(taskId) {
  try{ 
    await fetchContacts(taskId);
  }
  catch(error){
    console.error("Error fetching contacts:", error);
    // openErrorPage();
  }
}


/**
 * Updates button images so only the active priority has its white version.
 * @param {string} priority - The currently selected priority.
 */
function showPriorityButton(priority) {
    const activeButtonUrgent = document.querySelector(`.priority-button[data-priority="urgent"] img`);
    const activeButtonMedium = document.querySelector(`.priority-button[data-priority="medium"] img`);
    const activeButtonLow = document.querySelector(`.priority-button[data-priority="low"] img`);
    activeButtonUrgent.src = '../assets/icons/urgent.png';
    activeButtonMedium.src = '../assets/icons/medium.png';
    activeButtonLow.src = '../assets/icons/low.png';
    if(priority === 'urgent'){
        activeButtonUrgent.src =  '../assets/icons/urgentwhite.png';
    }
    else if(priority === 'medium'){
        activeButtonMedium.src =  '../assets/icons/mediumwhite.png';
    }
    else if(priority === 'low'){
        activeButtonLow.src =  '../assets/icons/lowwhite.png';
    }
}


/**
 * Updates the UI for the active priority button and sets the input value.
 * @param {string} priority - The priority to activate.
 * @param {NodeList} buttons - The collection of priority button elements.
 * @param {HTMLInputElement} input - The input element to store the selected priority.
 */
function activatePriority(priority, buttons, input) {
    buttons.forEach(button => button.classList.remove('urgent', 'medium', 'low'));
    const activeButton = document.querySelector(`.priority-button[data-priority="${priority}"]`);
    if (activeButton) {
        showPriorityButton(priority);
        activeButton.classList.add(priority);
        input.value = priority;
    }
}


/**
 * Binds click events to priority buttons.
 * @param {NodeList} buttons - The collection of priority button elements.
 * @param {HTMLInputElement} input - The input element to store the selected priority.
 */
function bindPriorityEvents(buttons, input) {
    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            activatePriority(button.dataset.priority, buttons, input);
        });
    });
}


/**
 * Initializes the priority button system with an optional initial value.
 * @param {string} [initialPriority] - The priority to pre-select on initialization.
 */
function setupPriorityButtons(initialPriority) {
    const priorityButtons = document.querySelectorAll('.priority-button');
    const priorityInput = document.getElementById('priorityInput');
    if (initialPriority) {
        activatePriority(initialPriority, priorityButtons, priorityInput);
    }
    bindPriorityEvents(priorityButtons, priorityInput);
}


/**
 * get the contacts already assigned to the task and return them as an array them.
 * @param {string} taskId 
 * @returns array of contacts already assigned to the task
 */
async function getAlreadySubtask(taskId){
    const subtaskListRef = ref(database, `tasks/${taskId}`);
    try{
        const data = await get(subtaskListRef);
        if(data.exists()){
            subtasklistItem = [];
            const subtasks =  data.val().subtasks;
            for( let i in subtasks){
                subtasklistItem.push(subtasks[i]);
            }
            return subtasklistItem;
        }
    }catch(error){
        openErrorPage();
    } 
}


/**
 * add a new contact to the list of contacts, if the contact already exists, it will be remove
 * @param {number} id contact id
 * @returns array of contacts
 */
function getAssignedContactById(id){
    alreadyAssigned = !alreadyAssigned ? [] : alreadyAssigned;
    let contactRef = document.getElementById(id);
    contactRef.addEventListener('click', function(){
        const name = contactRef.value.trim();
        const newContact = { name: name,  checked: tru }
        if(!alreadyAssigned.find(item => item.name === newContact.name)){
            alreadyAssigned.push(newContact);
        }else{
            const index = alreadyAssigned.indexOf(newContact);
            alreadyAssigned.splice(index, 1);
        }
    })
    return alreadyAssigned;
}


/**
 * add a new Assigned contact to the container of assigned contacts for more user interaction
 */
function renderAssignedUsers() {
    alreadyAssignedContainer.innerHTML = '';
    for(let i=0; i<alreadyAssigned.length; i++) {
        const assignedTo = alreadyAssigned[i];
        alreadyAssignedContainer.innerHTML += `<span>${getAbbreviation(assignedTo.name)}</span>`;        
    }
}


/**
 * this function add a new subtask to the subtask list
 * @returns array of subtasks
 */
function addSubstask(){
    let SubtasklistContainer =  document.getElementById('subtaskListEdit');
    let newSubtaskRef = document.getElementById('subtask-input');
    let newSubtask = newSubtaskRef.value.trim();
    if(newSubtask){
        const subtask = {title: newSubtask,checked: false,}
        subtasklistItem.push(subtask);
        SubtasklistContainer.innerHTML+= `<li class="subtask">${subtask.title}</li>`; 
        newSubtaskRef.value = '';
    }else{
        SubtasklistContainer.innerHTML+="";
    }
    return subtasklistItem;
}


/**
 * Gets all edited task data from the form and updates it in Firebase.
 * @param {string} taskId The unique ID of the task to be updated.
 */
async function getEditedTask(taskId, event) {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priorityInput');
    const newTitle = taskTitleInput ? taskTitleInput.value.trim() : '';
    const newDescription = taskDescriptionInput ? taskDescriptionInput.value.trim() : '';
    const newDueDate = dueDateInput ? dueDateInput.value : ''; 
    const newPriority = priorityInput ? priorityInput.value : 'medium';
    const newAssignedTo = alreadyAssigned ? alreadyAssigned : [];
    const newSubtasks = subtasklistItem ? subtasklistItem : [];
    const updatedTaskData = { title: newTitle, description: newDescription, dueDate: newDueDate, priority: newPriority, assignedTo: newAssignedTo, subtasks: newSubtasks};
    await updateTaskInDatabase(updatedTaskData, taskId);
    closePopUp(event);
}


/**
 * change the task information in the database using the edited task data.
 * @param {object} updatedTaskData  the new task object data
 * @param {*} taskId 
 */
async function updateTaskInDatabase(updatedTaskData, taskId) {
    const taskRef = ref(database, `tasks/${taskId}`);
    try {
        await update(taskRef, updatedTaskData);
        initiateBoard();
    } catch (error) {
        openErrorPage();
    }
    subtasklistItem = [];
    alreadyAssigned = [];
}



/**
 * Escapes special characters in a string for safe inline JavaScript usage.
 * Specifically, it escapes backslashes, single quotes, and double quotes.
 * @param {string} str - The input string to escape.
 * @returns {string} The escaped string safe for inline JavaScript.
 */
function escapeForInlineJS(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")     
        .replace(/"/g, '\\"');    
}


/**
 * start subtask edit
 */
function getEditedSubtask(){
    const subsTasks = document.querySelectorAll('#subtaskListEdit .subtask-item');
    subsTasks.forEach((subtask) => {
        subtask.addEventListener('click', function(){
            if(subtask.querySelector('input')){
                return
            }
            const subtaskContent = subtask.querySelector('li').textContent.trim();
            subtask.innerHTML = "";
            subtask.innerHTML = templateRenderFormEditSubtask(subtaskContent);
        })
    })
}



/**
 * change the subtask list item to edit mode
 * @param {*} subtaskContent subtask content
 * @returns html template for edit subtask
 */
function templateRenderFormEditSubtask(subtaskContent){
    const subtaskTitle = escapeForInlineJS(subtaskContent);
    return `
        <label>
            <input type="text" value="${subtaskContent}" id="subtaskEdit"/>
            <div class="img-icons">
                <span class="delete-icon" onclick="deleteSubtaskInEdited('${subtaskTitle}')">
                    <img src="./assets/icons/delete.png"alt="search icon" />
                </span>
                <span class="check-icon" onclick="modifySubtaskInEdited('${subtaskTitle}')">
                    <img src="./assets/icons/checkgrey.png" alt="search icon" />
                </span>
            </div>
        </label>
    `;
}


/**
 * modifie the value of the subtask in the list
 * @param {string} subtaskContent subtask value
 * @returns 
 */
function modifySubtaskInEdited(subtaskContent){
    const input = document.getElementById('subtaskEdit');
    if (!Array.isArray(subtasklistItem)) {
        return;
    }
    const found = subtasklistItem.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) {
        return;
    }else if(found>= 0){
        const newValue = input.value;
        subtasklistItem[found] = {
            title: newValue.trim(),
            checked: false
        };
        input.value = '';
        const contain = input.closest(".subtask-item");
        contain.outerHTML = `<div class="subtask-item"><li>${newValue}</li></div>`;
        initiateBoard();
    }
}


/**
 * remove subtask from the list
 * @param {string} subtaskContent subtask value
 * @returns 
 */
function deleteSubtaskInEdited(subtaskContent){
    const input = document.getElementById('subtaskEdit');
     if (!Array.isArray(subtasklistItem)) {
        return;
    }
    const found = subtasklistItem.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) {
        return;
    }else if(found>= 0){
        subtasklistItem.splice(found, 1);
        const contain = input.closest(".subtask-item");
        contain.outerHTML = '';
        initiateBoard();
    }
}


export{setupPriorityButtons, getAlreadySubtask, getAlreadyAssigned, renderAssignedUsers, escapeForInlineJS, modifySubtaskInEdited, deleteSubtaskInEdited};

window.getEditedTask = getEditedTask;
window.addSubstask = addSubstask;
window.getEditedSubtask = getEditedSubtask;
window.getAssignedContactById = getAssignedContactById;
window.modifySubtaskInEdited = modifySubtaskInEdited;
window.deleteSubtaskInEdited = deleteSubtaskInEdited;
window.getUser = getUser;
window.fetchContacts = fetchContacts;

