const dataBaseURL ="https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let contactList = [];


document.addEventListener('DOMContentLoaded', function() {
    /**
     * Sets the navigation state by activating the 'addtask' nav item and deactivating
     * 'board', 'contacts', and 'summary' nav items. This function manipulates the
     * 'active' CSS class on the corresponding elements.
     */
    function activeNavItem(){
        document.getElementById('board').classList.remove('active');
        document.getElementById('contacts').classList.remove('active');
        document.getElementById('addtask').classList.add('active');
        document.getElementById('summary').classList.remove('active');
    }
    
    activeNavItem();
    setupPriorityButtons('medium');
    getCategory()
        
});


import {set, ref, database} from "./connection.js";
import { getAbbreviation} from "./board.js";
import { applyAssignedToColorSpan} from "./searchtask.js";
import {templateRenderContactOnBord } from "./templates.js";
let alreadyAssignedContainer = document.getElementById("assignedContact");

const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const dueDateInput = document.getElementById('dueDate');
const priorityInput = document.getElementById('priorityInput');
let categoryInput  = document.getElementById('categoryInput');
let errorTitle  = document.getElementById('errorTitle');
let errorDate  = document.getElementById('errorDate');
let errorCat  = document.getElementById('errorCat');
let resetButton  = document.getElementById('resetButton');
let assignedToList = [];
let subtasks = [];
const activeButtonUrgent = document.querySelector(`.priority-button[data-priority="urgent"] img`);
const activeButtonMedium = document.querySelector(`.priority-button[data-priority="medium"] img`);
const activeButtonLow = document.querySelector(`.priority-button[data-priority="low"] img`);


/**
 * Updates button images so only the active priority has its white version.
 * @param {string} priority - The currently selected priority.
 */
function showPriorityButton(priority) {
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


resetButton.addEventListener('click', function(){
    categoryInput.value ='';
    taskTitleInput.value ='';
    taskDescriptionInput.value = '';
    dueDateInput.value = ''; 
    priorityInput.value = '';
    let subtaskListEdit = document.getElementById('subtaskListEdit');
    subtaskListEdit.innerHTML = '';
})


/**
 * 
 * Retrieves the assigned contact by ID and adds an event listener to toggle its checked state.
 * If the contact is already assigned, it will be removed from the assignedToList.
 * @param {*} id contact ID to be assigned
 * @returns a list of assigned contacts
 */
function getAssignedContactById(id){
    let contactRef = document.getElementById(id);
    contactRef.addEventListener('click', function(){
        const name = contactRef.value.trim();
        const newContact = {
            name: name,
            checked: true
        }
        if(!assignedToList.find(item => item.name === newContact.name)){
            assignedToList.push(newContact);
        }else{
            const index = assignedToList.indexOf(newContact);
            assignedToList.splice(index, 1);
        }
        renderAssignedUsers();
    })
    return assignedToList;
}


/**
 * Renders the list of already assigned users in the assigned container.
 * Iterates through the assignedToList and creates a span for each user with their abbreviation.
 * Applies the assigned color span to each user.
 */
function renderAssignedUsers() {
    alreadyAssignedContainer.innerHTML = '';
    for(let i=0; i<assignedToList.length; i++) {
        const assignedTo = assignedToList[i];
        alreadyAssignedContainer.innerHTML += `<span>${getAbbreviation(assignedTo.name)}</span>`;        
    }
    applyAssignedToColorSpan();
}


/**
 * Adds a new subtask to the subtasks array and updates the display of subtasks.
 * @returns {Array} Returns the updated subtasks array after adding a new subtask.
 * Adds a new subtask to the subtasks array and updates the display of subtasks.
 */
function addSubstask(){
    let subtasklistContainer =  document.getElementById('subtaskListEdit');
    let newSubtaskRef = document.getElementById('subtask-input');
    let newSubtask = newSubtaskRef.value.trim();
    if(newSubtask){
        const subtask = {
            title: newSubtask,
            checked: false,
        }
        subtasks.push(subtask);
       showSubTask();
        newSubtaskRef.value = '';
    }else{
        subtasklistContainer.innerHTML+="";
    }
    return subtasks;
}


/**
 * Displays the list of subtasks in subtasklistcontainer.
 * Iterates through the subtasks array and creates a list item for each subtask.
 */
function showSubTask(){
    let subtasklistContainer =  document.getElementById('subtaskListEdit');
    subtasklistContainer.innerHTML = '';
    for(let i=0; i<subtasks.length; i++) {
        const subtask = subtasks[i];
        subtasklistContainer.innerHTML += `<div class="subtask" id="subTaskElement"><li class="">${subtask.title}</li><div class="img-icons"><span><img src="./assets/icons/delete.png" alt="delete" /></span><span onclick="modifySubtaskInEdited(${i}, '${subtask.title}')"><img src="./assets/icons/edit.png" alt="edit" /></span></div></div>`;
    }
}


/**
 * 
 * Modifies a subtask in the edit mode by replacing its content with an input field.
 * This allows the user to edit the subtask content directly.
 * @param {*} index  The index of the subtask to be modified.
 * @param {*} subtaskContent  The current content of the subtask to be edited.
 */
function modifySubtaskInEdited(index, subtaskContent) {
    let subtasklists =  document.querySelectorAll('#subtaskListEdit .subtask');
    subtasklists.forEach((subtask, index) => {
        subtask.addEventListener('click', function() {
            if(subtask.querySelector('input')){
                return
            }
            subtask.innerHTML = "";
            subtask.innerHTML = `
            <input type="text" value="${subtaskContent}" />
            <div class="img-icons">
            <span><img src="./assets/icons/delete.png" alt="delete" /></span>
            <span><img src="./assets/icons/edit.png" alt="edit" /></span>
            </div>
            `;
        });
    })
}


/**
 * Retrieves all task data from the form inputs and constructs a task object.
 * The task object includes properties like title, description, due date, category, priority, assigned contacts, and subtasks.
 * The function then calls `getAddTask` to save the task data to Firebase.
 */
function getTaskData(){
    let category  = categoryInput.value ? categoryInput.value.trim(): "User Test"
    let newTitle = taskTitleInput.value ? taskTitleInput.value.trim() : '';
    let newDescription = taskDescriptionInput.value ? taskDescriptionInput.value.trim() : '';
    let newDueDate = dueDateInput.value ? dueDateInput.value : ''; 
    let newPriority = priorityInput.value ? priorityInput.value : 'medium';
    let newAssignedTo = assignedToList ? assignedToList: [];
    let newSubtasks = subtasks ? subtasks : [];
    const taskData = {
        id: Date.now(),
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
        category: category,
        range: "toDo",
        priority: newPriority,
        assignedTo: newAssignedTo,
        subtasks: newSubtasks
    };
    getAddTask(taskData) 
}


/**
 * Validates the form inputs for task creation.
 * Checks if the task title, due date, and category are filled out.
 * @returns {boolean} Returns true if there are no errors in the form, otherwise false.
 */
function renderError() {
    let hasError = false;
    if (!taskTitleInput.value.trim()) {
        taskTitleInput.classList.add('field-error');
        errorTitle.classList.remove('hide');
        hasError = true;
    }
    if (!dueDateInput.value.trim()) {
        dueDateInput.classList.add('field-error');
        errorDate.classList.remove("hide");
        hasError = true;
    }
    if (!categoryInput.value.trim()) {
        categoryContain.classList.add('field-error');
        errorCat.classList.remove('hide');
        hasError = true;
    }
    removeError();
    return !hasError;
}


/**
 * Removes error classes and hides error messages after a delay.
 * 
 */
function removeError(){
    setTimeout(()=>{
        taskTitleInput.classList.remove('field-error');
        dueDateInput.classList.remove('field-error');
        categoryContain.classList.remove('field-error');
        errorTitle.classList.add('hide');
        errorDate.classList.add("hide");
        errorCat.classList.add('hide');
    }, 3000);
}


/**
 * Gets all edited task data from the form and updates it in Firebase.
 * @param {string} taskId The unique ID of the task to be updated.
 */
async function getAddTask(taskData) {
    const taskRef = ref(database, `tasks/${taskData.id}`);
    try {
        if(renderError()){
           await set(taskRef, taskData);
            showSucessMessage() 
        }else{
            console.log("you got a probleme during add task")
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
}


/**
 * Toggles the visibility of the assigned contacts container in the Add Task form.
 * If the container is hidden, it will be displayed and populated with contacts.
 * @param {event} event 
 */
function showContainerOnBoardAddTask(event){
  let contactBoard = document.getElementById("assigned");
  let AssignToLabel = document.getElementById("assigned-to");
  if (contactBoard.classList.contains("hide")) {
    contactBoard.classList.remove("hide");
    contactBoard.classList.add("dFlex");
    AssignToLabel.classList.add('addheigth');
    getUser();
  } else {
    contactBoard.classList.add("hide");
    contactBoard.classList.remove("dFlex");
    AssignToLabel.classList.remove('addheigth');
  }
  event.stopPropagation();
}


/**
 * Retrieves the selected category from the dropdown and updates the input field accordingly.
 * This function also sets up event listeners for category options.
 */
function getCategory(){
    let categoryInput  = document.getElementById('categoryInput');
    let options = document.querySelectorAll(".category option");
    options.forEach(category=>{
        category.addEventListener('click', function(){
            categoryInput.value = category.value;
        })
    })
    showCategory()
}


/**
 * Displays a success message after a task is successfully added and redirects to the board.
 */
function showSucessMessage() {
    let successMessage = document.getElementById("successMessageTask");
    successMessage.classList.remove("hide");
    setTimeout(() => {
        successMessage.classList.add("hide");
        openBoard(); 
    }, 1000);
}


/**
 * 
 * Toggles the visibility of the category list and adjusts the label height accordingly.
 * @returns {void}
 */
function showCategory(){
    let labelCategory  = document.getElementById('labelCategory');
    let categoryList  = document.getElementById('category');
    if(categoryList.classList.contains('hide')){
        categoryList.classList.remove('hide')
        labelCategory.classList.add('addheigth');
    }else{
        labelCategory.classList.remove('addheigth');
        categoryList.classList.add('hide');
    }
}


/**
 * Fetches all contacts from the database and renders them on the assigned conntainer in Addtask form.
 * @returns {Promise<void>}
 * @throws {Error} If the fetch operation fails, it will open an error page.
 */
async function getUser(){
  try{ 
    const response = await fetch(dataBaseURL + "/.json"); 
    const contactData = await response.json(); 
    const contactIdList = Object.keys(contactData.contacts);
    renderContact(contactIdList, contactData);
  }
  catch(error){
    openErrorPage();
  }
}

/**
 * render all contacts on the assigned container in Addtask form.
 * @param {Array} contactIdList list of contact IDs to be rendered
 * @param {*} contactData contatct data fetched from the database
 */
function renderContact(contactIdList, contactData) {
    let contactBoard = document.getElementById("assigned");
    contactList = [];
    for(let index=0; index <contactIdList.length; index++){
      let contactID = contactIdList[index];
      let contact = contactData.contacts[contactID];
      contactList.push(contact);
      contactBoard.innerHTML += templateRenderContactOnBord(contact);
      applyAssignedToColorSpan();
    }
}


let actualUser = localStorage.getItem("userName");
if (actualUser === 'nouser' ) {
  window.location.href = `login.html`;
}

export{setupPriorityButtons };

window.getTaskData = getTaskData;
window.setupPriorityButtons = setupPriorityButtons;
window.addSubstask = addSubstask;
window.getAssignedContactById = getAssignedContactById;
window.showContainerOnBoardAddTask = showContainerOnBoardAddTask;
window.showCategory = showCategory;
window.getCategory = getCategory;
window.modifySubtaskInEdited = modifySubtaskInEdited;