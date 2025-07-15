const dataBaseURL =
  "https://join-8035a-default-rtdb.europe-west1.firebasedatabase.app";
let query = "tasks";
/**
 * Sets the ID of the currently dragged task.
 * @param {number} id - The ID of the task being dragged.
 */
function startDragging(id) {
  currentDraggedTask = id;
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
 * Moves the currently dragged task to a specified category.
 *
 * Finds the task in the global `tasks` array by its `id` (using `currentDraggedTask`),
 * updates its `category` property, and reloads the tasks display.
 * If the task is not found, logs a warning to the console.
 *
 * @param {string} range - The target category to move the task to.
 */

async function moveTo(range) {
  const taskID = currentDraggedTask;
  try {
    const response = await fetch(`${dataBaseURL}/${query}/${taskID}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task with ID ${taskID}`);
    }
    const task = await response.json();
    await updateRangeTask(task, range)
    initiateBoard(); // Refresh board
  } catch (error) {
    console.error("Error moving task:", error);
  } finally {
    currentDraggedTask = null;
  }
}

async function updateRangeTask(task, range) {
  if (!task) {
      console.warn("Task not found for ID:", task.id);
      return;
  }
  task.range = range;
  const updateResponse = await fetch(`${dataBaseURL}/${query}/${task.id}.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!updateResponse.ok) {
    throw new Error(`Failed to update task with ID ${task.id}`);
  }
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
  document.getElementById(id).classList.add("add-height");
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drop area by removing a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("add-height");
  document.getElementById(id).classList.remove("drag-area-highlight");
}
