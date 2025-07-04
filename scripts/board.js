/**
 * Loads all tasks and renders them into their respective category columns on the board.
 *
 * - Extracts unique categories from the global `tasks` array.
 * - For each category, finds and displays tasks belonging to that category using `findTasksByCategory`.
 * - Applies color styling to assigned user initials via `applyAssignedToColors`.
 *
 * @function
 */
let tasks = [
  {
    id: 1,
    type: "User Story",
    title: "Pokedex Show name and Description",
    description: "Display the name and description for each Pokémon in the Pokedex.",
    subtask: [
      { title: "Fetch Pokémon data", done: true },
      { title: "Display name", done: false },
      { title: "Display description", done: false }
    ],
    assignedTo: ["RT", "KS", "AR"],
    category: "toDo",
    grade: "medium"
  },
  {
    id: 2,
    type: "Bug",
    title: "Fix login redirect",
    description: "Users are not redirected to the dashboard after login.",
    subtask: [
      { title: "Check login response", done: true },
      { title: "Update redirect logic", done: false }
    ],
    assignedTo: ["MJ"],
    category: "done",
    grade: "urgent"
  },
  {
    id: 3,
    type: "Feature",
    title: "Add dark mode",
    description: "Implement dark mode toggle for the application.",
    subtask: [
      { title: "Design dark theme", done: false },
      { title: "Implement toggle", done: false }
    ],
    assignedTo: ["LS", "AB"],
    category: "awaitReview",
    grade: "low"
  },
  {
    id: 4,
    type: "User Story",
    title: "Profile picture upload",
    description: "Allow users to upload and change their profile picture.",
    subtask: [
      { title: "Create upload UI", done: true },
      { title: "Handle file storage", done: true },
      { title: "Update user profile", done: true }
    ],
    assignedTo: ["RT"],
    category: "toDo",
    grade: "medium"
  },
  {
    id: 5,
    type: "Improvement",
    title: "Optimize board loading speed",
    description: "Refactor code and optimize queries to improve board loading performance.",
    subtask: [
      { title: "Profile current performance", done: true },
      { title: "Optimize queries", done: false }
    ],
    assignedTo: ["AK", "BL"],
    category: "inProgress",
    grade: "urgent"
  },
  {
    id: 6,
    type: "Task",
    title: "Update documentation",
    description: "Update the project documentation for the latest release.",
    subtask: [
      { title: "Review new features", done: false },
      { title: "Update README", done: false }
    ],
    assignedTo: ["CJ"],
    category: "toDo",
    grade: "low"
  }
];

let todo = document.getElementById("toDoTask");
let awaitReview = document.getElementById("awaitReviewTask");
let inProgress = document.getElementById("inProgressTask");
let done = document.getElementById("doneTask");
let todoPlacehoder = document.getElementById("toDoTaskPlaceholder");
let awaitReviewPlaceholder = document.getElementById("awaitReviewTaskPlaceholder");
let inProgressPlaceholder = document.getElementById("inProgressTaskPlaceholder");
let donePlaceholder = document.getElementById("doneTaskPlaceholder");
let currentDraggedTask;

const letterColors = {
  A: '#e57373', B: '#f06292', C: '#ba68c8', D: '#9575cd', E: '#7986cb',
  F: '#64b5f6', G: '#4fc3f7', H: '#4dd0e1', I: '#4db6ac', J: '#81c784',
  K: '#aed581', L: '#dce775', M: '#fff176', N: '#ffd54f', O: '#ffb74d',
  P: '#ff8a65', Q: '#a1887f', R: '#e67e22', S: '#8e44ad', T: '#34495e',
  U: '#16a085', V: '#27ae60', W: '#2980b9', X: '#8e44ad', Y: '#f39c12',
  Z: '#c0392b'
};


/**
 * Initializes the board by loading all tasks and applying assigned-to colors.
 */
function initiateBoard() {
  loadTasks();
}


/**
 * Loads all tasks, finds unique categories, renders tasks by category,
 * and applies color styling to assigned user initials.
 */
function loadTasks(){
  let categories = [...new Set(tasks.map(t => t.category))];
  console.log("Unique categories found:", categories);
  for(let i = 0; i< categories.length; i++){
    let category = categories[i];
    findTasksByCategory(category);
  }
  applyAssignedToColors();
}


/**
 * Finds and renders all tasks for a given category name.
 * Hides placeholder if tasks exist and appends each task card to the correct column.
 * @param {string} categoryName - The category to filter tasks by.
 */
function findTasksByCategory(categoryName) {
  let taskForThisCat = tasks.filter(task => task.category === categoryName);
  const categoryTask = categoryName + "Task";
  // const categoryPlaceholder = categoryName + "TaskPlaceholder";
  categoryTask.innerHTML = "";
  for(let i = 0; i < taskForThisCat.length; i++) {
    let task = taskForThisCat[i];
    switch (task.category) {
      case "toDo":
        if (task) {
          todoPlacehoder.classList.add("hide");
        }
        todo.innerHTML += templateTaskCard(task);
        break;
      case "awaitReview":
        if (task) {
          awaitReviewPlaceholder.classList.add("hide");
        }
        awaitReview.innerHTML += templateTaskCard(task);
        break;
      case "inProgress":
        if (task) {
          inProgressPlaceholder.classList.add("hide");
        }
        inProgress.innerHTML += templateTaskCard(task);
        break;
      case "done":
        if (task) {
          donePlaceholder.classList.add("hide");
        }
        done.innerHTML += templateTaskCard(task);
        break;
      default:
        console.warn(`Unknown category: ${task.category}`);
    }
  }
}


/**
 * Counts the total number of subtasks for a given task.
 * @param {Object} task - The task object.
 * @returns {number} The number of subtasks.
 */
function countSubtasks(task) {
  return task.subtask ? task.subtask.length : 0;
}


/**
 * Counts the number of completed subtasks for a given task.
 * @param {Object} task - The task object.
 * @returns {number} The number of completed subtasks.
 */
function countSubtasksDone(task) {
  if (!Array.isArray(task.subtask)) return 0;
  return task.subtask.filter(sub => sub.done === true).length;
}



/**
 * Generates the HTML template for a task card.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for the task card.
 */
function templateTaskCard(task){
  return `
    <div class="taskCard" draggable="true" ondragstart="startDragging(${task.id})" onclick="clicked(${task.id})">
      <div class="taskCard-header">
        <span class="taskType">${task.type}</span>
        <img src="./assets/icons/iconoir_cancel.png" alt="cancel" class="hide" />
      </div>
      <h4>${task.title}</h4>
      <p class="taskCard-body">${task.description}</p>
      <div class="progress">
        <progress id="subtask" value="${countSubtasksDone(task) / countSubtasks(task) * 100}" max="100"> % </progress>
        <label for="subtask">${countSubtasksDone(task)}/${countSubtasks(task)}Subtasks</label>
      </div>
      <div class="taskCard-footer">
        <div class="asigned-to">
            ${task.assignedTo.map(user => `<span>${user}</span>`).join('')}
        </div><img src="./assets/icons/${task.grade}.png" alt="" class="taskGrade">
      </div>  
    </div>
  `;
}




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
 * @param {string} category - The target category to move the task to.
 */

/**
 * Moves the currently dragged task to a specified category.
 *
 * Finds the task in the global `tasks` array by its `id` (using `currentDraggedTask`),
 * updates its `category` property, and reloads the tasks display.
 * If the task is not found, logs a warning to the console.
 *
 * @param {string} category - The target category to move the task to.
 */
function moveTo(category) {
  const taskIndex = tasks.findIndex(task => task.id === currentDraggedTask);
  if (taskIndex !== -1) {
    tasks[taskIndex].category = category;
    loadTasks();
  } else {
    console.warn("Task not found for moving:", currentDraggedTask);
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
function clicked(id){
  console.log("Task clicked:", id);
}


/**
 * Highlights a drop area by adding a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}


/**
 * Removes the highlight from a drop area by removing a CSS class.
 * @param {string} id - The ID of the drop area element.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

