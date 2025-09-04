const dataBaseURL =
  "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let query = "tasks";

let contactList = [];
let contactBoard = document.getElementById("assigned");


/**
 * Sets the ID of the currently dragged task.
 * @param {number} id - The ID of the task being dragged.
 */
function startDragging(id) {
  currentDraggedTask = id;
  document.getElementById(id).classList.add('rotate');
}


/**
 * open the Board page with location.href
 */
function openAddTask(){
  document.location.href ="add-task.html";
}


/**
 * finds the Task by Id and delete the task from the database.
 * @param {number} taskId task ID to be deleted
 * @param {Event} event The event object associated with the click event.
 */
async function deleteTask(taskId, event) {
  try {
    const response = await fetch(`${dataBaseURL}/${query}/${taskId}.json`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    initiateBoard(); // Refresh
  } catch (error) {
    openErrorPage();
  }
  closePopUp(event);
}


/**
 * Handles the closing of a popup by toggling the 'hide' class on the element
 * with the ID 'taskCardParent'. Prevents the event from propagating further.
 *
 * @param {Event} event - The event object associated with the popup close action.
 */
function closePopUp(event) {
  document.getElementById("taskCardParent").classList.toggle("hide");
  if (event && event.stopPropagation) {
    event.stopPropagation();
  }
}


/**
 * Prevents the event from propagating (bubbling) up the DOM tree.
 *
 * @param {Event} event - The event object to stop propagation for.
 */
function preventEvent(event) {
  event.stopPropagation();
}


/**
 * Allows a drop event by preventing the default behavior.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event, id) {
  event.preventDefault();
  const currentDragContainer = event.target.closest('.draggable-section');
  if (!currentDragContainer) return;
  let placeholder = currentDragContainer.querySelector('.placeholderTask');
  if (!placeholder) {
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholderTask");
    currentDragContainer.appendChild(placeholder);
  }
  placeholder.classList.remove("hide");
  removeHighlightFromOthers(id);
}


/**
 * Highlights a drop area by adding a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function highlight(id) {
  document.getElementById(id).innerHTML += showPlaceholderTask();
}


/**
 * start drag and show the placeholder task
 * @param {boolean} startDragged 
 * @param {*number} id contains the id of the range(toDo, inProgress, awaitingFeedback or done) container where task is being dragged.
 */
function moveToHover(startDragged, range){
  if(startDragged){
    try{
      moveTo(currentDraggedTask, range);
      startDragged = false;
    }catch{
      openErrorPage();
    }
  }
}


/**
 * close all popup for mobile move if one are open.
 */
function closeAllOpenMove(){
  let moveTaskMobileAll=  document.querySelectorAll('.move-mobile-task');
  moveTaskMobileAll.forEach( movetask=>{
    movetask.classList.add('hide');
  })
}


/**
 * open the popup for move task if a user are in mobile
 * @param {number} taskId task id
 * @param {event} event event
 */
function openMoveTaskMobile(taskId, event){
  closeAllOpenMove();
  const parentTask = document.getElementById(taskId);
  const moveTaskMobile = parentTask.querySelector('#moveTaskMobile');
  moveTaskMobile.classList.toggle('hide');
  event.stopPropagation();
}


/**
 * 
 * @returns {string} A string representing a placeholder task element.
 */
function showPlaceholderTask(){
  return `
    <div class="placeholderTask">
              
    </div>
  `;
}


/**
 * Removes the highlight from a drop area by removing a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function removeHighlightFromOthers(activeId) {
  document.querySelectorAll(".draggable-section").forEach(section => {
    if (section.id !== activeId) {
      const placeholder = section.querySelector(".placeholderTask");
      if (placeholder) placeholder.classList.add("hide");
    }
  });
}


/**
 * open the contaier of the assigned contacts input to show this in the board for editing or adding tasks.
 * Toggles the visibility of the assigned contacts container by adding or removing classes.
 */
function showContainerOnBoard(taskId, event) {
  let contactBoard = document.getElementById("assigned");
  if (contactBoard.classList.contains("hide")) {
    contactBoard.classList.remove("hide");
    contactBoard.classList.add("dFlex");
    getUser(taskId);
  } else {
    contactBoard.classList.add("hide");
    contactBoard.classList.remove("dFlex");
  }
  event.stopPropagation();
}


/**
 * Sets the 'active' class on the board navigation item and removes it from other navigation items.
 * This function highlights the board section in the navigation bar.
 */
function activeNavItem() {
  document.getElementById("board").classList.add("active");
  document.getElementById("contacts").classList.remove("active");
  document.getElementById("addtask").classList.remove("active");
  document.getElementById("summary").classList.remove("active");
}


function loadAddtask(){
  document.getElementById('taskCardParent').classList.remove('hide');
  document.getElementById("addTaskBoard").innerHTML = templateAddTaskInBoard();
}


actualUser = localStorage.getItem("userName");
if (!actualUser || actualUser === '' ) {
  window.location.href = `login.html`;
}
