import { initiateBoard } from "./board.js";
import {ref, update,get,  database} from "./connection.js";

let assignedToList = [];
let alreadyAssigned = [];
let subtasklistItem = [];
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


async function getAlreadyAssigned(taskId){
    const assignedRef = ref(database, `tasks/${taskId}`);
    try{
        const data = await get(assignedRef);
        if(data.exists()){
            alreadyAssigned = data.val().assignedTo;
            return alreadyAssigned;
        }
    }catch(error){
        console.log(error);
    }
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
        SubtasklistContainer.innerHTML+= `<li class="subtask">${subtask.title}</li>`; 
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
async function getEditedTask(taskId, event) {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priorityInput');
    const newTitle = taskTitleInput ? taskTitleInput.value.trim() : '';
    const newDescription = taskDescriptionInput ? taskDescriptionInput.value.trim() : '';
    const newDueDate = dueDateInput ? dueDateInput.value : ''; 
    const newPriority = priorityInput ? priorityInput.value : 'medium';
    subtasklistItem = await getAlreadySubtask(taskId);
    alreadyAssigned = await getAlreadyAssigned(taskId);
    const newAssignedTo = getAssignedContactById(taskId) ? getAssignedContactById(taskId) : [];
    const newSubtasks = addSubstask() ? addSubstask() : [];
    const updatedTaskData = {
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
        priority: newPriority,
        assignedTo: alreadyAssigned.concat(newAssignedTo),
        subtasks: subtasklistItem.concat(newSubtasks)
    };
    const taskRef = ref(database, `tasks/${taskId}`);
    try {
        await update(taskRef, updatedTaskData);
        console.log(updatedTaskData);
        initiateBoard();
        closePopUp(event);
        console.log(`Task with ID ${taskId} updated successfully!`);
    } catch (error) {
        console.error("Error updating task:", error);
    }
    subtasklistItem = [];
    alreadyAssigned = [];
}



function getEditedSubtask(taskId){
    const subsTasks = document.querySelectorAll('#subtaskListEdit subtask-item');
    subsTasks.forEach((subtask) => {
        subtask.addEventListener('click', function(){
            if(subtask.querySelector('input')){
                return
            }
            const subtaskContent = subtask.textContent;
            subtask.innerHTML = "";
            subtask.innerHTML = `
            <label class="label-subtask-edit">
                <input type="text" value="${subtaskContent}" focus />
                <span class="img-edit"> <img onclick="deleteSubtaskInEdited(${taskId})" src="./assets/icons/delete.png"/> <img onclick='modifySubtaskInEdited("${subtaskContent}")' src="./assets/icons/edit.png"/> </span>
            </label>
            `;
        })
    })
}

function modifySubtaskInEdited(subtaskContent){
    if (!Array.isArray(subtasklistItem) || !Array.isArray(subtasks)) {
        console.error("One or both arrays are not defined or not arrays");
        return;
    }
    const found =
    subtasklistItem.find(item => item.title === subtaskContent) || subtasks.find(subtask => subtask.title === subtaskContent);
    if (!found) {
        return
    }else{
        console.log(true);

    }


}

function deleteSubtaskInEdited(taskId,index){
    console.log("delete", taskId, index);
}


export{setupPriorityButtons, getAlreadySubtask, getAlreadyAssigned };

window.getEditedTask = getEditedTask;
window.addSubstask = addSubstask;
window.getEditedSubtask = getEditedSubtask;
window.getAssignedContactById = getAssignedContactById;
window.modifySubtaskInEdited = modifySubtaskInEdited;
window.deleteSubtaskInEdited = deleteSubtaskInEdited;

