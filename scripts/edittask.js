import { initiateBoard } from "./board.js";
import {ref, update,get,  database} from "./connection.js";
const dataBaseURL =
  "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let alreadyAssigned = [];
let subtasklistItem = [];
let contactListGlobal = [];
let contactIdList = [];
let alreadyAssignedContainer = document.getElementById("alreadyAssigned");



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
 * Manages the active state of priority buttons and updates the hidden input.
 * Call this once on load and attach to button click events.
 * @param {string} initialPriority The priority to initially set as active (e.g., 'urgent', 'medium', 'low')
 */
function setupPriorityButtons(initialPriority) {
    const priorityButtons = document.querySelectorAll('.priority-button');
    const priorityInput = document.getElementById('priorityInput');
    const setActivePriority = (priority) => {
        priorityButtons.forEach(button => {
            button.classList.remove('urgent', 'medium', 'low');
        });
        const activeButton = document.querySelector(`.priority-button[data-priority="${priority}"]`);
        if (activeButton) {
            activeButton.classList.add(priority); 
            priorityInput.value = priority; 
        }
    };
    if (initialPriority) {
        setActivePriority(initialPriority);
    }
    priorityButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const priority = button.dataset.priority;
            setActivePriority(priority);
        });
    });
}


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
        console.log("can't fetch this data", error);
    } 
}


function getAssignedContactById(id){
    alreadyAssigned = !alreadyAssigned ? [] : alreadyAssigned;
    let contactRef = document.getElementById(id);
    contactRef.addEventListener('click', function(){
        const name = contactRef.value.trim();
        const newContact = {
            name: name,
            checked: true
        }
        if(!alreadyAssigned.find(item => item.name === newContact.name)){
            alreadyAssigned.push(newContact);
        }else{
            const index = alreadyAssigned.indexOf(newContact);
            alreadyAssigned.splice(index, 1);
        }
    })
    return alreadyAssigned;
}


function renderAssignedUsers() {
    alreadyAssignedContainer.innerHTML = '';
    for(let i=0; i<alreadyAssigned.length; i++) {
        const assignedTo = alreadyAssigned[i];
        alreadyAssignedContainer.innerHTML += `<span>${getAbbreviation(assignedTo.name)}</span>`;        
    }
}



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



function escapeForInlineJS(str) {
    return str
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")     
        .replace(/"/g, '\\"');    
}


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



function modifySubtaskInEdited(subtaskContent){
    if (!Array.isArray(subtasklistItem)) {
        return;
    }
    const found = subtasklistItem.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) {
        return;
    }else if(found>= 0){
        const newValue = document.getElementById('subtaskEdit').value;
        subtasklistItem[found] = {
            title: newValue.trim(),
            checked: false
        };
    }
}


function deleteSubtaskInEdited(subtaskContent){
     if (!Array.isArray(subtasklistItem)) {
        return;
    }
    const found = subtasklistItem.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) {
        return;
    }else if(found>= 0){
        subtasklistItem.splice(found, 1);
    }
}


export{setupPriorityButtons, getAlreadySubtask, getAlreadyAssigned, renderAssignedUsers };

window.getEditedTask = getEditedTask;
window.addSubstask = addSubstask;
window.getEditedSubtask = getEditedSubtask;
window.getAssignedContactById = getAssignedContactById;
window.modifySubtaskInEdited = modifySubtaskInEdited;
window.deleteSubtaskInEdited = deleteSubtaskInEdited;
window.getUser = getUser;
window.fetchContacts = fetchContacts;

