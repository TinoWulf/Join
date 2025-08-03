const dataBaseURL ="https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let contactList = [];
document.addEventListener('DOMContentLoaded', function() {
    
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
import {templateRenderContactOnBord } from "./templates.js";

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


function showPriorityButton(priority) {
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
            showPriorityButton(priority);
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


resetButton.addEventListener('click', function(){
    categoryInput.value ='';
    taskTitleInput.value ='';
    taskDescriptionInput.value = '';
    dueDateInput.value = ''; 
    priorityInput.value = '';
    let subtaskListEdit = document.getElementById('subtaskListEdit');
    subtaskListEdit.innerHTML = '';
})


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
    })

    return assignedToList;
}


function addSubstask(){
    let SubtasklistContainer =  document.getElementById('subtaskListEdit');
    let newSubtaskRef = document.getElementById('subtask-input');
    let newSubtask = newSubtaskRef.value.trim();
    if(newSubtask){
        const subtask = {
            title: newSubtask,
            checked: false,
        }
        subtasks.push(subtask);
        SubtasklistContainer.innerHTML+= `<li class="subtask">${subtask.title}<button class="delete-subtask">Delete</button></li>`; 
        newSubtaskRef.value = '';
    }else{
        SubtasklistContainer.innerHTML+="";
    }
    return subtasks;
}


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
            console.log(taskData);
            showSucessMessage() 
        console.log(`Task with ID ${taskData.id} updated successfully!`);
        }else{
            console.log("you got a probleme during add task")
        }
    } catch (error) {
        console.error("Error creating task:", error);
    }
}


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

function showSucessMessage() {
    let successMessage = document.getElementById("success-message");
    successMessage.classList.remove("hide");
    setTimeout(() => {
        successMessage.classList.add("hide");
        openBoard(); 
    }, 1000);
}



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

async function getUser(){
  let contactBoard = document.getElementById("assigned");
  try{ 
    const response = await fetch(dataBaseURL + "/.json"); 
    const contactData = await response.json(); 
    const contactIdList = Object.keys(contactData.contacts);
    contactList = [];
    for(let index=0; index <contactIdList.length; index++){
      let contactID = contactIdList[index];
      let contact = contactData.contacts[contactID];
      contactList.push(contact);
      contactBoard.innerHTML += templateRenderContactOnBord(contact);
      applyAssignedToColorSpan();
    }
  }
  catch(error){
    throw new Error("Failled to connect to the database"+ error);
  }
}

export{setupPriorityButtons };

window.getTaskData = getTaskData;
window.setupPriorityButtons = setupPriorityButtons;
window.addSubstask = addSubstask;
window.getAssignedContactById = getAssignedContactById;
window.showContainerOnBoardAddTask = showContainerOnBoardAddTask;
window.showCategory = showCategory;
window.getCategory = getCategory;

