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
}

/**
 * @async
 * Renders a contact list for the task board.
 */
async function getUser(){
  try{ 
    await fetchContacts();
  }
  catch(error){
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
async function fetchContacts() {
  let contactBoard = document.getElementById("assigned");
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
  event.stopPropagation();
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
function allowDrop(event) {
  event.preventDefault();
}


/**
 * Highlights a drop area by adding a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function highlight(id) {
  document.getElementById(id).innerHTML += showPlaceholderTask();
}


/**
 * 
 * @param {boolean} startDragged 
 * @param {*number} id contains the id of the range(toDo, inProgress, awaitingFeedback or done) container where is being dragged.
 */
function moveToHover(startDragged, id){
  if(startDragged){
    highlight(id);
    startDragged = false;
  }
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
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}


/**
 * open the contaier of the assigned contacts input to show this in the board for editing or adding tasks.
 * Toggles the visibility of the assigned contacts container by adding or removing classes.
 */
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


let actualUser = localStorage.getItem("userName");
if (actualUser === 'nouser' ) {
  window.location.href = `login.html`;
}