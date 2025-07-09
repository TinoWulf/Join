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

/**
 * Moves the currently dragged task to a specified category.
 *
 * Finds the task in the global `tasks` array by its `id` (using `currentDraggedTask`),
 * updates its `category` property, and reloads the tasks display.
 * If the task is not found, logs a warning to the console.
 *
 * @param {string} range - The target category to move the task to.
 */

function moveTo(range) {
  if (!currentDraggedTask) {
    console.warn("No task is currently being dragged to move in ", range);
    return;
  } else {
    const taskID = currentDraggedTask;
    fetch(`${dataBaseURL}/${query}/${taskID}.json`)
      .then((response) => response.json())
      .then((task) => {
        if (task) {
          task.range = range;
          fetch(`${dataBaseURL}/${query}/${taskID}.json`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...task, range: range }),
          })
            .then(() => {
              initiateBoard(); 
            })
            .catch((error) => console.error("Error updating task:", error));
        } else {
          console.warn("Task not found for ID:", taskID);
        }
      });
  }
  currentDraggedTask = null; 
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
