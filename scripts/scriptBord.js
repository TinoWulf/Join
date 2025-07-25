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



async function deleteTask(taskId, event) {
  try {
    // const response = await fetch(`${dataBaseURL}/${query}/${taskId}.json`, {
    //   method: "DELETE",
    // });
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    console.log(" Task deleted");
    initiateBoard(); // Refresh
  } catch (error) {
    console.error("Delete task error:", error);
    alert("Error deleting this task");
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


function moveToHover(startDragged, id){
  if(startDragged){
    highlight(id);
    startDragged = false;
  }
}


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
