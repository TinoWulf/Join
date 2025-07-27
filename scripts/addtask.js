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
});


import {set, ref, database} from "./connection.js";
import {templateRenderContactOnBord } from "./templates.js";

let assignedToList = [];
let subtasks = [];


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


/**
 * Gets all edited task data from the form and updates it in Firebase.
 * @param {string} taskId The unique ID of the task to be updated.
 */
async function getAddTask(event) {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priorityInput');
    let category  = "User Test"
    const newTitle = taskTitleInput ? taskTitleInput.value.trim() : '';
    const newDescription = taskDescriptionInput ? taskDescriptionInput.value.trim() : '';
    const newDueDate = dueDateInput ? dueDateInput.value : ''; 
    const newPriority = priorityInput ? priorityInput.value : 'medium';
    const newAssignedTo = assignedToList ? assignedToList: [];
    const newSubtasks = subtasks ? subtasks : [];
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
    const taskRef = ref(database, `tasks/${taskData.id}`);
    try {
        await set(taskRef, taskData);
        openBoard();
        console.log(`Task with ID ${taskData.id} updated successfully!`);
    } catch (error) {
        console.error("Error creating task:", error);
    }
}


function showContainerOnBoard(){
  let contactBoard = document.getElementById("assigned");
  if (contactBoard.classList.contains("hide")) {
    contactBoard.classList.remove("hide");
    contactBoard.classList.add("dFlex");
    getUser();
  } else {
    contactBoard.classList.add("hide");
    contactBoard.classList.remove("dFlex");
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

window.getAddTask = getAddTask;
window.setupPriorityButtons = setupPriorityButtons;
window.addSubstask = addSubstask;
window.getAssignedContactById = getAssignedContactById;
window.showContainerOnBoard = showContainerOnBoard;

