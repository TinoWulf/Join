import {database,ref,update,get } from "./connection.js";
import {initialiseElements } from "./addtaskboard.js";
import {setupPriorityButtons, getAlreadySubtask } from "./edittask.js";
import {applyAssignedToColors } from "./searchtask.js";
import { templateTaskCard, templateTaskCardDetail, toDoPlaceholderTemplate, inProgressPlaceholderTemplate, awaitReviewPlaceholderTemplate, donePlaceholderTemplate, templateAddTaskInBoard } from "./templates.js";
let toDo = document.getElementById("toDoTask");
let awaitReview = document.getElementById("awaitReviewTask");
let inProgress = document.getElementById("inProgressTask");
let done = document.getElementById("doneTask");
let todoPlacehoder = document.getElementById("toDoTaskPlaceholder");
let awaitReviewPlaceholder = document.getElementById("awaitReviewTaskPlaceholder");
let inProgressPlaceholder = document.getElementById("inProgressTaskPlaceholder");
let donePlaceholder = document.getElementById("doneTaskPlaceholder");
let tasksList = [];


/**
 * Counts the total number of subtasks for a given task.
 * @param {Object} task - The task object.
 * @returns {number} The number of subtasks.
 */
function countSubtasks(task) {
  return task.subtasks ? task.subtasks.length : 0;
}


/**
 * get the range of the task and return as priority
 * @param {*} range  range of the task
 * @returns 
 */
function getPriority(range){
  let priority = range;
  return priority;
}


/**
 * Counts the number of completed subtasks for a given task.
 * @param {Object} task - The task object.
 * @returns {number} The number of completed subtasks.
 */
function countSubtasksDone(task) {
  if (!task.subtasks) {
    return 0;
  }
  return task.subtasks.filter((subtask) => subtask.checked).length;
}


/**
 * Returns the abbreviation formed by the first letter of each word in the input string, in uppercase.
 *
 * @param {string} str - The input string to abbreviate.
 * @returns {string} The abbreviation of the input string.
 */
function getAbbreviation(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}



/**
 * get All Tasks from the database
 */
async function getAllTasks() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      renderTaskOnBoard(snapshot);
    } else {
      return null;
    }
  } catch (error) {
    openErrorPage();
  }
}


/**
 * Renders tasks on the board from a Firebase snapshot.
 * Iterates over each task in the snapshot, adds it to the tasks list,
 * loads tasks, and creates a task card template for each task.
 *
 * @param {Object} snapshot - The Firebase snapshot containing tasks data.
 * @returns {Array} tasksList - An array of task objects extracted from the snapshot.
 */
function renderTaskOnBoard(snapshot){
  tasksList = [];
  const tasks = snapshot.val();
  for (let taskId in tasks) {
    const task = tasks[taskId];
    tasksList.push(task);
    loadTasks();
    templateTaskCard(task);
  }
  return tasksList;
}


/**
 * open the task detail page as a modal with the task details
 * @param {*} taskId task id to be edited
 */
function openTaskDetail(taskId) {
  let taskCardParent = document.getElementById("taskCardParent");
  taskCardParent.innerHTML = "";
  const task = tasksList.find((task) => task.id === taskId);
  taskCardParent.innerHTML = templateTaskCardDetail(task);
  applyAssignedToColors();
  submitCheckedSubtask(taskId);
  taskCardParent.classList.toggle("hide");
}


/**
 * open the task detail page as a modal in form of a form 
 * @param {*} taskId task id to be edited
 */
function openEditTask(taskId){
  let taskCardParentEdit = document.getElementById("taskCardParent");
  taskCardParentEdit.innerHTML = "";
  const task = tasksList.find((task) => task.id === taskId);
  fetchContacts(taskId);
  taskCardParentEdit.innerHTML = templateEditTask(task);
  setupPriorityButtons(task.priority);
  getAlreadySubtask(task.id);
  applyAssignedToColors();
}



/**
 * Loads all tasks, finds unique categories, renders tasks by category,
 * and applies color styling to assigned user initials.
 */
function loadTasks() {
  clearAllColums();
  let categories = [...new Set(tasksList.map((t) => t.range))];
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    findTasksByCategory(category);
  }
  applyAssignedToColors();
  activeNavItem();
}


/**
 * Clears the contents of all board columns and resets them to their placeholder templates.
 * 
 * This function empties the inner HTML of the columns: toDo, awaitReview, inProgress, and done,
 * then sets each column's inner HTML to its respective placeholder template.
 *
 * @function
 */
function clearAllColums() {
  toDo.innerHTML = "";
  toDo.innerHTML = toDoPlaceholderTemplate();
  awaitReview.innerHTML = "";
  awaitReview.innerHTML = awaitReviewPlaceholderTemplate();
  inProgress.innerHTML = "";
  inProgress.innerHTML = inProgressPlaceholderTemplate();
  done.innerHTML = "";
  done.innerHTML = donePlaceholderTemplate();
}


/**
 * Returns the DOM element with the specified ID.
 *
 * @param {string} id - The ID of the element to retrieve.
 * @returns {HTMLElement|null} The element with the given ID, or null if no such element exists.
 */
function getElementById(id){
  return document.getElementById(id);
}


/**
 * Finds and renders all tasks for a given category name.
 * Hides placeholder if tasks exist and appends each task card to the correct column.
 * @param {string} categoryName - The category to filter tasks by.
 */
function findTasksByCategory(categoryName) {
  let taskForThisCat = tasksList.filter((task) => task.range === categoryName);
  const categoryTask = categoryName + "Task";
  getElementById(categoryTask).innerHTML = "";
  for (let i = 0; i < taskForThisCat.length; i++) {
    let task = taskForThisCat[i];
    switchedRange(task);
  }
}


/**
 * Moves a task to the appropriate section on the board based on its range property.
 * Updates the DOM by hiding the relevant placeholder and appending the task card.
 *
 * @param {Object} task - The task object to be moved.
 * @param {string} task.range - The target range for the task ('toDo' or 'awaitReview' or 'inProgress' or 'done').
 */
function switchedRange(task) {
  switch (task.range) {
    case "toDo":
      insertTodoTask(task);
      break;
    case "awaitReview":
      insertAwaitReviewTask(task);
      break;
    case "inProgress":
      insertInProgressTask(task);
      break;
    case "done":
      insertDoneTask(task);
      break;
  }
}


/**
 * Inserts a task card into the "toDo" section of the board.
 * If no task is provided, displays a placeholder template.
 * Hides the placeholder element and appends the task card HTML.
 *
 * @param {Object} task - The task object to be inserted. If falsy, a placeholder is shown instead.
 */
function insertTodoTask(task) {
  if (!task) {
    toDo.innerHTML = toDoPlaceholderTemplate();
  }
  todoPlacehoder.classList.add("hide");
  toDo.innerHTML += templateTaskCard(task);
}


/**
 * Inserts a task card into the "Await review" section of the board.
 * If no task is provided, displays a placeholder template.
 * Hides the placeholder element and appends the task card HTML.
 *
 * @param {Object} task - The task object to be inserted. If falsy, a placeholder is shown instead.
 */
function insertAwaitReviewTask(task) {
  if (!task) {
    awaitReview.innerHTML = awaitReviewPlaceholderTemplate();
  }
  awaitReviewPlaceholder.classList.add("hide");
  awaitReview.innerHTML += templateTaskCard(task);
}


/**
 * Inserts a task card into the "Done" section of the board.
 * If no task is provided, displays a placeholder template.
 * Hides the placeholder element and appends the task card HTML.
 *
 * @param {Object} task - The task object to be inserted. If falsy, a placeholder is shown instead.
 */
function insertDoneTask(task) {
  if (!task) {
    done.innerHTML = donePlaceholderTemplate();
  }
  donePlaceholder.classList.add("hide");
  done.innerHTML += templateTaskCard(task);
}


/**
 * Inserts a task card into the "In Progress" section of the board.
 * If no task is provided, displays a placeholder template.
 * Hides the placeholder element and appends the task card HTML.
 *
 * @param {Object} task - The task object to be inserted. If falsy, a placeholder is shown instead.
 */
function insertInProgressTask(task) {
  if (!task) {
    inProgress.innerHTML = inProgressPlaceholderTemplate();
  }
  inProgressPlaceholder.classList.add("hide");
  inProgress.innerHTML += templateTaskCard(task);
}


/**
 * cheked or unchecked a subtask of a task and update the task status.
 * @param {*} taskId Task ID
 */
function submitCheckedSubtask(taskId){
  let inputSubtask = document.querySelectorAll('.form-check input');
  inputSubtask.forEach((input)=>{
    input.addEventListener('click', function(){
      const subtaskIndex = this.dataset.index; 
      const pathToUpdate = `tasks/${taskId}/subtasks/${subtaskIndex}/checked`;
      const updates = {
        [pathToUpdate]: this.checked 
      };
      update(ref(database), updates)
        .then(() => {
          initiateBoard();
        })
        .catch((error) => {
          openErrorPage();
        });
    })
  })
}


/**
 * change the range of the task in the database and reload the bord.
 * @param {*} range where the task will be moved (todo, inprogress,awaitingfeedback, done)
 */
async function moveTo(currentDraggedTask, range) {
  const taskID = currentDraggedTask;
  const taskRef = ref(database, "tasks/" + taskID);
  try {
    await update(taskRef, { range: range });
    loadTasks();
    initiateBoard();
  } catch (error) {
    openErrorPage();
  }
}

//.innerHTML = templateAddTaskInBoard()
function loadAddtask(){
  document.getElementById('taskCardParent').classList.remove('hide');
  const addTaskContainer = document.getElementById("addTaskBoard");
  try{
    addTaskContainer.innerHTML = templateAddTaskInBoard();
    initialiseElements();
    setupPriorityButtons('medium');
    getUser();
  }catch(error){
    console.error("Error loading add task template:", error);
  }
  
}


/**
 * initiateBoard() function is called when the board is loaded or when a task is moved.
 * Load all tasks from the database and display them on the board.
 * 
 */
function initiateBoard() {
  getAllTasks();
}

export { initiateBoard, findTasksByCategory, getAbbreviation, countSubtasks, countSubtasksDone, openTaskDetail, moveTo,getPriority, tasksList};


window.initiateBoard = initiateBoard;
window.findTasksByCategory = findTasksByCategory;
window.getAbbreviation = getAbbreviation;
window.countSubtasks = countSubtasks;
window.countSubtasksDone = countSubtasksDone;
window.loadTasks = loadTasks;
window.openTaskDetail = openTaskDetail;
window.moveTo = moveTo;
window.getPriority = getPriority;
window.openEditTask = openEditTask;
window.loadAddtask = loadAddtask;

