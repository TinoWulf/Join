import {set, ref, database} from "./connection.js";
import { getAbbreviation} from "./board.js";
import { applyAssignedToColorSpan} from "./searchtask.js";
import {templateRenderContactAddTask } from "./templates.js";
import {escapeForInlineJS, setupPriorityButtons } from "./edittask.js";
let labelSubtask = document.getElementById("addSubtask");
let errorSubtask = document.getElementById("errorSubtask");
let addSubtaskRef  = document.getElementById('addSubtask');
let imgAddsubtaskPlus  = document.querySelector('.img-addsubtask');
let imgIconsAddsubtask  = document.getElementById('imgIcons');
let assignedToList = [];
let subtasksList = [];
let contactList = [];
const dataBaseURL ="https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
setupPriorityButtons('medium');      

/**
 * Retrieves the assigned contact by ID and adds an event listener to toggle its checked state.
 * If the contact is already assigned, it will be removed from the assignedToList.
 * @param {number} id contact ID to be assigned
 * @returns a list of assigned contacts
 */
function getAssignedToAddTask(id, event){
    let contactRef = document.getElementById(id);
    const name = contactRef.value.trim();
    if(contactRef.checked){
        const newContact = {name: name,  checked: true }
        if(!assignedToList.find(item => item.name === newContact.name)){
            assignedToList.push(newContact);
        }
    }else{
        assignedToList = assignedToList.filter(item => item.name !== name);
    }
    renderAssignedUsers();
    event.stopPropagation();
    return assignedToList;
}


/**
 * Renders the list of already assigned users in the assigned container.
 * Iterates through the assignedToList and creates a span for each user with their abbreviation. Applies the assigned color span to each user.
 */
function renderAssignedUsers() {
    const alreadyAssignedContainer = document.getElementById("assignedContact");
  alreadyAssignedContainer.innerHTML = '';
  for (let i = 0; i < assignedToList.length; i++) {
    if (i < 4) {
      const assignedTo = assignedToList[i];
      alreadyAssignedContainer.innerHTML += `<span>${getAbbreviation(assignedTo.name)}</span>`;
    } else if (i === 4) {
      const remaining = assignedToList.length - 4;
      alreadyAssignedContainer.innerHTML += `<span>+${remaining}</span>`;
      break; 
    }
  }
  applyAssignedToColorSpan();
}


/**
 * Retrieves the selected category from the dropdown and updates the input field accordingly. This function also sets up event listeners for category options.
 */
function getCategory(event){
    const contactBoardAddtask = document.getElementById("assigned");
    contactBoardAddtask.classList.add("hide");
    let categoryInput  = document.getElementById('categoryInput');
    let options = document.querySelectorAll(".category option");
    options.forEach(category=>{
        category.addEventListener('click', function(){
            categoryInput.value = category.value;
        })
    })
    showCategory();
    event.stopPropagation();
}


/**
 * Adds a new subtask to the subtasks array and updates the display of subtasks.
 * @returns {Array} Returns the updated subtasks array after adding a new subtask.
 * Adds a new subtask to the subtasks array and updates the display of subtasks.
 */
function addSubtaskAddTask(){
    let newSubtaskRef = document.getElementById('subtask-input');
    let newSubtask = newSubtaskRef.value.trim();
    const already = !!subtasksList.find(item => item.title == newSubtask);
    if(newSubtask && newSubtask!="" && !already){
        const subtask = { title: newSubtask,checked: false}
        subtasksList.push(subtask);
       showSubTask();
        newSubtaskRef.value = '';
    }else{
        labelSubtask.classList.add('field-error');
        errorSubtask.innerHTML = "This subtask already exists!"
        newSubtaskRef.value = newSubtask;
        clearAddSubtaskError();
    }
    return subtasksList;
}


/**
 * Displays the list of subtasks in subtasklistcontainer.
 * Iterates through the subtasks array and creates a list item for each subtask.
 */
function showSubTask(){
    let subtasklistContainer =  document.getElementById('subtaskListEdit');
    subtasklistContainer.innerHTML = '';
    for(let i=0; i<subtasksList.length; i++) {
        const subtask = subtasksList[i];
        const subtaskTitle = escapeForInlineJS(subtask.title);
        subtasklistContainer.innerHTML += `<div class="subtask" id="subTaskElement"><li class="">${subtask.title}</li><div class="img-icons"><span onclick="deleteSubtaskInEdited('${subtaskTitle}')"><img src="./assets/icons/delete.png" alt="delete" /></span><span onclick="getEditedSubtask()"><img src="./assets/icons/edit.png" alt="edit" /></span></div></div>`;
    }
}


/**
 * 
 * Toggles the visibility of the category list and adjusts the label height accordingly.
 * @returns {void}
 */
function showCategory(){
    let categoryList  = document.getElementById('category');
    if(categoryList.classList.contains('hide')){
        categoryList.classList.remove('hide')
    }else{
        categoryList.classList.add('hide');
    }
}


/**
 * start change subtask form <li> element to input element
 */
function getEditedSubtask(){
    const subsTasks = document.querySelectorAll('#subtaskListEdit .subtask');
    subsTasks.forEach((subtask) => {
        subtask.addEventListener('click', function(){
            if(subtask.querySelector('input')){
                return;
            }
            const subtaskContent = subtask.querySelector('li').textContent.trim();
            subtask.innerHTML = "";
            subtask.innerHTML = templateRenderFormEditSubtask(subtaskContent);
        })
    })
}


/**
 * change the contain of the subtask element to the edit form.
 * @param {string} subtaskContent value of the subtask
 * @returns 
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
 * modifie the subtask value in the subtask list
 * @param {string} subtaskContent value of the subtask
 * @returns 
 */
function modifySubtaskInEdited(subtaskContent){
    const input = document.getElementById('subtaskEdit');
    if (!Array.isArray(subtasksList)) { return;}
    const found = subtasksList.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) { return;}
    else if(found>= 0){
        if(!input.value.trim() || input.value.length < 2){ return; }
        const newValue = input.value;
        subtasksList[found] = {title: newValue.trim(), checked: false};
        input.value = '';
        showSubTask();
    }
}


/**
 * remove the subtask in the subtask list
 * @param {string} subtaskContent  value of the subtask
 * @returns 
 */
function deleteSubtaskInEdited(subtaskContent){
     if (!Array.isArray(subtasksList)) {
        return;
    }
    const found = subtasksList.findIndex(item => item.title === subtaskContent.trim());
    if (found<0) {
        return;
    }else if(found>= 0){
        subtasksList.splice(found, 1);
        showSubTask();
    }
}


/**
 * check if the "date" ist already passed or is in the futur.
 * @param {date} date a date
 * @returns return true or false
 */
function isDueDatePassed(date) {
  if (!date) return false; 
  const dueDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}


/**
 * Retrieves all task data from the form inputs and constructs a task object. The task object includes properties like title, description, due date, category, priority, assigned contacts, and subtasks.
 *  The function then calls `getAddTask` to save the task data to Firebase.
 */
function getTaskData(){
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priorityInput');
    const categoryInput  = document.getElementById('categoryInput');
    let category  = categoryInput.value ? categoryInput.value.trim(): "User Test"
    let newTitle = taskTitleInput.value ? taskTitleInput.value.trim() : '';
    let newDescription = taskDescriptionInput.value ? taskDescriptionInput.value.trim() : '';
    let newDueDate = dueDateInput.value ? dueDateInput.value : ''; 
    let newPriority = priorityInput.value ? priorityInput.value : 'medium';
    let newAssignedTo = assignedToList ? assignedToList: [];
    let newSubtasks = subtasksList ? subtasksList : [];
    const taskData = {id: Date.now(), title: newTitle,  description: newDescription,  dueDate: newDueDate, category: category, range: "toDo", priority: newPriority, assignedTo: newAssignedTo,  subtasks: newSubtasks};
    getAddTask(taskData);
}


/**
 * Validates the form inputs for task creation. Checks if the task title, due date, and category are filled out.
 * @returns {boolean} Returns true if there are no errors in the form, otherwise false.
 */
function renderError() {
    let hasError = false;
    const dueDateInput = document.getElementById('dueDate');
    const dueDate = dueDateInput.value.trim();
    const taskTitleInput = document.getElementById('taskTitle');
    const categoryInput  = document.getElementById('categoryInput');
    const errorCat  = document.getElementById('errorCat');
    const errorTitle  = document.getElementById('errorTitle');
    const errorDate  = document.getElementById('errorDate');
    hasError = validateDueDate(dueDate);
    if (!taskTitleInput.value.trim()) {
        taskTitleInput.classList.add('field-error');
        errorTitle.classList.remove('hide');
        hasError = true;
    }
    if (!categoryInput.value.trim()) {
        categoryContain.classList.add('field-error');
        errorCat.classList.remove('hide');
        hasError = true;
    }
    removeError(errorTitle, errorDate, errorCat);
    return !hasError;
}


/**
 * check if the date was enter by user if not the render the error mesage by remove the hide class in the error field
 * or if the date is already passed. it remove the hide class and add the message "THE DATE IS ALREADY PASSED" 
 * @param {string} dueDate date 
 * @returns true or false
 */
function validateDueDate(dueDate) {
    let hasError = false;
    const dueDateInput = document.getElementById('dueDate');
    const errorDate  = document.getElementById('errorDate');
  if (!dueDate) {
    dueDateInput.classList.add('field-error');
    errorDate.classList.remove("hide");
    hasError = true;
  } 
  else if (isDueDatePassed(dueDate)) {
    dueDateInput.classList.add('field-error');
    errorDate.classList.remove("hide");
    errorDate.innerHTML = "This date is already passed";
    hasError = true;
  }
  return hasError;
}


/**
 * Removes error classes and hides error messages after a delay.
 */
function removeError(errorTitle, errorDate, errorCat){
    setTimeout(()=>{
        document.getElementById('taskTitle').classList.remove('field-error');
        document.getElementById('dueDate').classList.remove('field-error');
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
           openBoard(); 
        }else{
            return;
        }
    } catch (error) {
        console.log("Error adding task: ", error);
    }
}


/**
 * Toggles the visibility of the assigned contacts container in the Add Task form. If the container is hidden, it will be displayed and populated with contacts.
 * @param {event} event use to stop the Progation in other container
 */
function showContainerOnBoardAddTask(event){
    let categoryList  = document.getElementById('category');
    let contactBoard = document.getElementById("assigned");
    if (contactBoard.classList.contains("hide")) {
        contactBoard.classList.remove("hide");
        contactBoard.classList.add("dFlex");
    } else {
        contactBoard.classList.add("hide");
        contactBoard.classList.remove("dFlex");
    }
    categoryList.classList.add('hide');
    event.stopPropagation();
}


/**
 * Fetches all contacts from the database and renders them on the assigned conntainer in Addtask form. If the fetch operation fails, it will open an error page.
 */
async function getUser(){
  try{ 
    const response = await fetch(dataBaseURL + "/.json"); 
    const contactData = await response.json(); 
    const contactIdList = Object.keys(contactData.contacts);
    renderContact(contactIdList, contactData);
    activeNavItem();
  }
  catch(error){
    openErrorPage();
  }
}


/**
 * render all contacts on the assigned container in Addtask form.
 * @param {Array} contactIdList list of contact IDs to be rendered
 * @param {Object} contactData contatct data fetched from the database
 */
function renderContact(contactIdList, contactData) {
    let contactBoard = document.getElementById("assigned");
    contactList = [];
    for(let index=0; index <contactIdList.length; index++){
      let contactID = contactIdList[index];
      let contact = contactData.contacts[contactID];
      contactList.push(contact);
      contactBoard.innerHTML += templateRenderContactAddTask(contact);
      applyAssignedToColorSpan();
    }
}


/**
 * set and after 1s clear the error message in addSubtask input.
 */
function clearAddSubtaskError(){
  let labelSubtask = document.getElementById("addSubtask");
  let errorSubtask = document.getElementById("errorSubtask");
  labelSubtask.classList.add('field-error');
  errorSubtask.innerHTML = "This subtask already exists!"
  setTimeout(()=>{
    labelSubtask.classList.remove('field-error');
    errorSubtask.innerHTML = ""
  },2000)
}


/**
 * close drowpdown by assigned contact
 * @param {string} event 
 */
function closeDropDown(event){
    let categoryList  = document.getElementById('category');
    let contactBoardAddtask = document.getElementById("assigned");
    contactBoardAddtask.classList.add("hide");
    contactBoardAddtask.classList.remove("dFlex");
    categoryList.classList.add('hide');
    event.stopPropagation();
}


 function clearTask(){
  document.getElementById('categoryInput').value ='';
  document.getElementById('taskTitle').value ='';
  document.getElementById('taskDescription').value = '';
  document.getElementById('dueDate').value = ''; 
  document.getElementById('priorityInput').value = '';
  window.contactList = [];
  window.subtasksList = [];
  document.getElementById('subtaskListEdit').innerHTML = '';;
  document.getElementById('assignedContact').innerHTML = '';;
  document.getElementById("assigned").innerHTML = '';
  window.assignedToList = [];
  setupPriorityButtons('medium');
  getUser();
}


let inputAddSubtask = addSubtaskRef?.querySelector('input');
inputAddSubtask?.addEventListener('focus', function(){
    imgAddsubtaskPlus.hidden = true;
    imgIconsAddsubtask.classList.add('show-icons');
})

inputAddSubtask?.addEventListener("blur", () => {
  if (!inputAddSubtask.value.trim()) {
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
  }
});


/**
 * this function hide the input for edit subtask after this one is already edited.
 */
function deleteSubtaskInput(){
    inputAddSubtask.value = '';
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
}


export{setupPriorityButtons, isDueDatePassed, getTaskData, getUser, addSubtaskAddTask, getAssignedToAddTask, showContainerOnBoardAddTask,
    showCategory, getEditedSubtask, modifySubtaskInEdited, deleteSubtaskInEdited, subtasksList, contactList };

window.getTaskData = getTaskData;
window.getUser = getUser;
window.setupPriorityButtons = setupPriorityButtons;
window.addSubtaskAddTask = addSubtaskAddTask;
window.getAssignedToAddTask = getAssignedToAddTask;
window.showContainerOnBoardAddTask = showContainerOnBoardAddTask;
window.deleteSubtaskInput = deleteSubtaskInput;
window.getCategory = getCategory;
window.showCategory = showCategory;
window.getEditedSubtask = getEditedSubtask;
window.modifySubtaskInEdited = modifySubtaskInEdited;
window.deleteSubtaskInEdited = deleteSubtaskInEdited;
window.closeDropDown = closeDropDown;
window.clearTask = clearTask;