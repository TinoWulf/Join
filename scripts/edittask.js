import {ref, update, database} from "./connection.js";

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

/**
 * Extracts the currently assigned users from the UI.
 * This is a placeholder; you'll need to adapt it based on your
 * specific "Assigned to" selection implementation.
 * For now, it reads from the 'alreadyAssigned' div,
 * but for true editing, you'd likely have checkboxes/selects.
 *
 * @returns {Array<{name: string, id?: string}>} An array of assigned user objects.
 */
function getAssignedUsersFromUI() {
    const alreadyAssignedContainer = document.getElementById('alreadyAssigned');
    const assignedContact = document.getElementById('assigned');
    const contactListes = assignedContact.querySelectorAll('.option span');
        contactListes.forEach(contact => {
            contact.addEventListener('click', () => {
                const name = contact.textContent.trim();
                if (!assignedToList.some(item => item.name === name)) {
                    assignedToList.push({ name });
                    console.log('Added:', name, assignedToList);
                }
            });
            
        });

    // if (alreadyAssignedContainer) {
    //     const userSpans = alreadyAssignedContainer.querySelectorAll('span');
    //     userSpans.forEach(span => {
    //         assignedToList.push({ name: span.textContent.trim() });
    //     });
    // }
    console.table(assignedToList);
    return assignedToList;
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
}


function addSubstask(){
    let SubtasklistContainer =  document.getElementById('subtaskListEdit');
    let newSubtask = document.getElementById('subtask-input').value.trim();
    if(newSubtask){
        const subtask = {
            title: newSubtask,
            checked: false,
        }
        subtasks.push(subtask);
        console.log(subtask);
        for(let i = 0; i < subtasks.length; i++){
            let newSubtaskElement = subtasks[i];
            console.log(newSubtaskElement);
            SubtasklistContainer.innerHTML+= `<li class="subtask">${newSubtaskElement.title}<button class="delete-subtask">Delete</button></li>`;
        }
    }else{
        alert('Please enter a new subtask');
    }
}


/**
 * Extracts subtasks from the UI.
 * Assumes subtasks are dynamically added to #subtaskListEdit,
 * each with a text input and possibly a checkbox for status.
 *
 * @returns {Array<{text: string, completed: boolean}>} An array of subtask objects.
 */
function getSubtasksFromUI() {
    const subtaskListEdit = document.getElementById('subtaskListEdit');
    if (subtaskListEdit) {
        const subtaskItems = subtaskListEdit.querySelectorAll('.subtask-item');
        subtaskItems.forEach(item => {
            const textInput = item.querySelector('.subtask-text');
            const completedCheckbox = item.querySelector('.subtask-status');
            if (textInput) {
                subtasks.push({
                    text: textInput.value.trim(),
                    completed: completedCheckbox ? completedCheckbox.checked : false 
                });
            }
        });
    }
    return subtasks;
}


/**
 * Gets all edited task data from the form and updates it in Firebase.
 * @param {string} taskId The unique ID of the task to be updated.
 */
async function getEditedTask(taskId) {
    const taskTitleInput = document.getElementById('taskTitle');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priorityInput');
    const newTitle = taskTitleInput ? taskTitleInput.value.trim() : '';
    const newDescription = taskDescriptionInput ? taskDescriptionInput.value.trim() : '';
    const newDueDate = dueDateInput ? dueDateInput.value : ''; 
    const newPriority = priorityInput ? priorityInput.value : 'medium';
    const newAssignedTo = getAssignedUsersFromUI();
    const newSubtasks = getSubtasksFromUI();
    const updatedTaskData = {
        title: newTitle,
        description: newDescription,
        dueDate: newDueDate,
        priority: newPriority,
        assignedTo: newAssignedTo,
        subtasks: newSubtasks
    };
    console.log(updatedTaskData);
    const taskRef = ref(database, `tasks/${taskId}`);
    try {
        console.log(`Task with ID ${taskId} updated successfully!`);
    } catch (error) {
        console.error("Error updating task:", error);
    }
}


export{setupPriorityButtons };

window.getEditedTask = getEditedTask;
window.addSubstask = addSubstask;
window.getAssignedContactById = getAssignedContactById;

