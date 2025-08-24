let labelCategory  = document.getElementById('labelCategory');
let categoryList  = document.getElementById('category');
let contactBoard = document.getElementById("assigned");
let AssignToLabel = document.getElementById("assigned-to");
const taskTitleInput = document.getElementById('taskTitle');
const taskDescriptionInput = document.getElementById('taskDescription');
const dueDateInput = document.getElementById('dueDate');
const priorityInput = document.getElementById('priorityInput');
let categoryInput  = document.getElementById('categoryInput');
let errorTitle  = document.getElementById('errorTitle');
let errorDate  = document.getElementById('errorDate');
let errorCat  = document.getElementById('errorCat');
let resetButton  = document.getElementById('resetButton');
let addSubtaskRef  = document.getElementById('addSubtask');
let imgAddsubtaskPlus  = document.querySelector('.img-addsubtask');
let imgIconsAddsubtask  = document.getElementById('imgIcons');



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
 * close drowpdown by assigned contact
 * @param {string} event 
 */
function closeDropDown(event){
    contactBoard.classList.add("hide");
    contactBoard.classList.remove("dFlex");
    categoryList.classList.add('hide');
    event.stopPropagation();
}


let actualUser = localStorage.getItem("userName");
if (!actualUser || actualUser === '' ) {
  window.location.href = `login.html`;
}


resetButton.addEventListener('click', function(){
    categoryInput.value ='';
    taskTitleInput.value ='';
    taskDescriptionInput.value = '';
    dueDateInput.value = ''; 
    priorityInput.value = '';
    let subtaskListEdit = document.getElementById('subtaskListEdit');
    let AssignedContact = document.getElementById('assignedContact');
    subtaskListEdit.innerHTML = '';
    AssignedContact.innerHTML = '';
    assignedToList = [];
    subtasks = [];
    contactList = [];
    setupPriorityButtons('medium');
    getUser();
})


let inputAddSubtask = addSubtaskRef.querySelector('input');
inputAddSubtask.addEventListener('focus', function(){
    imgAddsubtaskPlus.hidden = true;
    imgIconsAddsubtask.classList.add('show-icons');
})

inputAddSubtask.addEventListener("blur", () => {
  if (!inputAddSubtask.value.trim()) {
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
  }
});

function deleteSubtaskInput(){
    inputAddSubtask.value = '';
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
}


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
