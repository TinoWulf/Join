let labelCategory  = document.getElementById('labelCategory');
let categoryList  = document.getElementById('category');
let contactBoardAddtask = document.getElementById("assigned");
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
let labelSubtask = document.getElementById("addSubtask");
let errorSubtask = document.getElementById("errorSubtask");


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
 * Retrieves the selected category from the dropdown and updates the input field accordingly. This function also sets up event listeners for category options.
 */
function getCategory(event){
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
    contactBoardAddtask.classList.add("hide");
    contactBoardAddtask.classList.remove("dFlex");
    categoryList.classList.add('hide');
    event.stopPropagation();
}

actualUser = localStorage.getItem("userName");
if (!actualUser || actualUser === '' ) {
  window.location.href = `login.html`;
}


resetButton.addEventListener('click', function(){
  categoryInput.value ='';
  location.reload();
  taskTitleInput.value ='';
  taskDescriptionInput.value = '';
  dueDateInput.value = ''; 
  priorityInput.value = '';
  window.contactList = [];
  window.subtasks = [];
  let subtaskListEdit = document.getElementById('subtaskListEdit');
  let AssignedContact = document.getElementById('assignedContact');
  subtaskListEdit.innerHTML = '';
  AssignedContact.innerHTML = '';
  contactBoardAddtask.innerHTML = '';
  window.assignedToList.length = 0;
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


/**
 * this function hide the input for edit subtask after this one is already edited.
 */
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
