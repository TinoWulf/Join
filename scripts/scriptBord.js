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
    const urlquery = `${dataBaseURL}/${query}/${currentDraggedTask}/.json`;
    fetch(urlquery)
        .then((response) => {
            if( !response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }else{
                let data = response.json();
                const taskFind =data;    
                console.log("Fetched task data:", data);
                console.log(taskFind);

            }
    })
    //   .then((data) => {
    //     console.log("Fetched tasks:", data);
    //     const task = Object.values(data).find(
    //       (task) => task.id === currentDraggedTask
    //     );
    //     if (task) {
    //       const updatedTask = { ...task, range };
    //       console.log("Updating task:", updatedTask);
    //       fetch(urlquery, {
    //         method: "PUT", // or "PUT" depending on your API
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(updatedTask),
    //       })
    //         .then((res) => res.json())
    //         .then((updatedTask) => {
    //           console.log("Task updated:", updatedTask);
    //         })
    //         .catch((error) => {
    //           console.error("Update failed:", error);
    //         });
    //     } else {
    //       console.warn("Task with ID", currentDraggedTask, "not found.");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching tasks:", error);
    //   });
    currentDraggedTask = null;
  }
}

/**
 * Allows a drop event by preventing the default behavior.
 * @param {DragEvent} event - The drag event.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles the click event on a task card.
 * @param {number} id - The ID of the clicked task.
 */
function clicked(id, event) {
  event.stopPropagation(); // Prevents the click from propagating to parent elements
  console.log("Task clicked:", id);
}

/**
 * Highlights a drop area by adding a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function highlight(id) {
  const dropArea = document.getElementById(id);
  dropArea.classList.add("add-height");
  dropArea.classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drop area by removing a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function removeHighlight(id) {
  const dropArea = document.getElementById(id);
  dropArea.classList.remove("add-height");
  dropArea.classList.remove("drag-area-highlight");
}
