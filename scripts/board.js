import {
  database,
  app,
  ref,
  set,
  onValue,
  update,
  push,
  remove,
  get,
  query,
} from "./connection.js";
import { templateTaskCard, templateTaskCardDetail, toDoPlaceholderTemplate, inProgressPlaceholderTemplate, awaitReviewPlaceholderTemplate, donePlaceholderTemplate } from "./templates.js";
let toDo = document.getElementById("toDoTask");
let awaitReview = document.getElementById("awaitReviewTask");
let inProgress = document.getElementById("inProgressTask");
let done = document.getElementById("doneTask");
let todoPlacehoder = document.getElementById("toDoTaskPlaceholder");
let awaitReviewPlaceholder = document.getElementById(
  "awaitReviewTaskPlaceholder"
);
let inProgressPlaceholder = document.getElementById(
  "inProgressTaskPlaceholder"
);
let donePlaceholder = document.getElementById("doneTaskPlaceholder");
let tasksList = [];

const letterColors = {
  A: "#e57373",
  B: "#f06292",
  C: "#ba68c8",
  D: "#9575cd",
  E: "#7986cb",
  F: "#64b5f6",
  G: "#4fc3f7",
  H: "#4dd0e1",
  I: "#4db6ac",
  J: "#81c784",
  K: "#aed581",
  L: "#dce775",
  M: "#fff176",
  N: "#ffd54f",
  O: "#ffb74d",
  P: "#ff8a65",
  Q: "#a1887f",
  R: "#e67e22",
  S: "#8e44ad",
  T: "#34495e",
  U: "#16a085",
  V: "#27ae60",
  W: "#2980b9",
  X: "#8e44ad",
  Y: "#f39c12",
  Z: "#c0392b",
};

/**
 * Initializes the board by loading all tasks and applying assigned-to colors.
 */
function getElementById(id) {
  return document.getElementById(id);
}

/**
 * Counts the total number of subtasks for a given task.
 * @param {Object} task - The task object.
 * @returns {number} The number of subtasks.
 */
function countSubtasks(task) {
  return task.subtasks ? task.subtasks.length : 0;
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

function getAbbreviation(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function applyAssignedToColors() {
  document.querySelectorAll(".asigned-to span").forEach((spantask) => {
    const firstLetter = spantask.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    spantask.style.backgroundColor = color;
  });
  document.querySelectorAll(".taskCardPopup ul li span").forEach((spanuser) => {
    const firstLetterUser = spanuser.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetterUser] || "#000";
    spanuser.style.backgroundColor = color;
  });
  document.querySelectorAll(".taskCard-header span").forEach((spancategory) => {
    const firstLetter = spancategory.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    spancategory.style.backgroundColor = color;
  });
}

async function getAllTasks() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (snapshot.exists()) {
      tasksList = [];
      const tasks = snapshot.val();
      for (let taskId in tasks) {
        const task = tasks[taskId];
        tasksList.push(task);
        loadTasks();
        templateTaskCard(task);
      }
      return tasksList;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving tasks:", error);
  }
}

function openTaskDetail(taskId) {
  let taskCardParent = document.getElementById("taskCardParent");
  taskCardParent.innerHTML = "";
  const task = tasksList.find((task) => task.id === taskId);
  taskCardParent.innerHTML = templateTaskCardDetail(task);
  applyAssignedToColors();
  taskCardParent.classList.toggle("hide");
}

/**
 * Searches a list of tasks by title, description, and category
 * @param {Array} tasks - Array of task objects
 * @param {string} keyword - The keyword to search for
 * @returns {Array} - Filtered list of tasks matching the keyword
 */
function searchTasks(tasks, keyword) {
  if (!keyword) return tasks;
  const lowerKeyword = keyword.trim().toLowerCase();
  return tasks.filter((task) => {
    const inTitle = task.title.toLowerCase().includes(lowerKeyword);
    const inDescription = task.description.toLowerCase().includes(lowerKeyword);
    const inCategory = task.category.toLowerCase().includes(lowerKeyword);
    return inTitle || inDescription || inCategory;
  });
}

function searchParticularTask() {
  let searchInput = document.getElementById("searchValue").value;
  let showSearchResult = document.getElementById("containerBoard");
  let resultSearch = searchTasks(tasksList, searchInput);
  tasksList = [];
  showSearchResult.innerHTML = "";
  for (let taskindex in resultSearch) {
    const task = resultSearch[taskindex];
    if (showSearchResult) {
      showSearchResult.innerHTML += templateTaskCard(task);
      applyAssignedToColors();
      initiateBoard();
    } else {
      showSearchResult.innerHTML =
        "The Problem occur during the search result or the search result is empty";
    }
  }
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
}

function clearAllColums(category) {
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

function insertTodoTask(task) {
  if (!task) {
    toDo.innerHTML = toDoPlaceholderTemplate();
  }
  todoPlacehoder.classList.add("hide");
  toDo.innerHTML += templateTaskCard(task);
}

function insertAwaitReviewTask(task) {
  if (!task) {
    awaitReview.innerHTML = awaitReviewPlaceholderTemplate();
  }
  awaitReviewPlaceholder.classList.add("hide");
  awaitReview.innerHTML += templateTaskCard(task);
}

function insertDoneTask(task) {
  if (!task) {
    done.innerHTML = donePlaceholderTemplate();
    donePlaceholder.classList.add("show");
  }
  donePlaceholder.classList.add("hide");
  done.innerHTML += templateTaskCard(task);
}

function insertInProgressTask(task) {
  if (!task) {
    inProgress.innerHTML = inProgressPlaceholderTemplate();
  }
  inProgressPlaceholder.classList.add("hide");
  inProgress.innerHTML += templateTaskCard(task);
}

/**
 * Retrieves the current user's name from localStorage and updates the DOM element
 * with the user's initials. If no user is found, sets a default initial 'G'.
 *
 * Depends on a function `getAbbreviation` to generate initials from the username.
 * Updates the element with id 'initial-user'.
 */
function callUserData() {
  let actualUser = localStorage.getItem("userName");
  if (actualUser && actualUser !== "null") {
    document.getElementById("initial-user").textContent =
      getAbbreviation(actualUser);
  } else {
    document.getElementById("initial-user").textContent = "G";
  }
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

async function moveTo(range) {
  const taskID = currentDraggedTask;
  const rangeId = `${range}Task`;
  const taskRef = ref(database, "tasks/" + taskID);
  try {
    await update(taskRef, { range: range });
    loadTasks();
    removeHighlight(rangeId);
    initiateBoard();
  } catch (error) {
    console.warn("Error modifying task range:", error);
  }
}

function initiateBoard() {
  activeNavItem();
  callUserData();
  getAllTasks();
}

export {
  initiateBoard,
  findTasksByCategory,
  getAbbreviation,
  countSubtasks,
  countSubtasksDone,
  applyAssignedToColors,
  callUserData,
  openTaskDetail,
  searchParticularTask,
  moveTo,
};

window.initiateBoard = initiateBoard;
window.findTasksByCategory = findTasksByCategory;
window.getAbbreviation = getAbbreviation;
window.countSubtasks = countSubtasks;
window.countSubtasksDone = countSubtasksDone;
window.applyAssignedToColors = applyAssignedToColors;
window.loadTasks = loadTasks;
window.callUserData = callUserData;
window.openTaskDetail = openTaskDetail;
window.searchParticularTask = searchParticularTask;
window.moveTo = moveTo;
