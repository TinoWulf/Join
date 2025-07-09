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
  child,
  query,
} from "../connection.js";
import { templateTaskCard } from "./templates.js";

/**
 * Loads all tasks and renders them into their respective category columns on the board.
 *
 * - Extracts unique categories from the global `tasks` array.
 * - For each category, finds and displays tasks belonging to that category using `findTasksByCategory`.
 * - Applies color styling to assigned user initials via `applyAssignedToColors`.
 *
 * @function
 */

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
const categoryMap = {
    toDo: { container: toDo, placeholder: todoPlacehoder },
    awaitReview: {
      container: awaitReview,
      placeholder: awaitReviewPlaceholder,
    },
    inProgress: { container: inProgress, placeholder: inProgressPlaceholder },
    done: { container: done, placeholder: donePlaceholder },
  };

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
  document.querySelectorAll(".asigned-to span").forEach((span) => {
    const firstLetter = span.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    span.style.backgroundColor = color;
  });
  document.querySelectorAll(".taskCard-header span").forEach((span) => {
    const firstLetter = span.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    span.style.backgroundColor = color;
  });
}


async function getAllTasks() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (!snapshot.exists()) return null;
    const tasks = snapshot.val();
    tasksList = [];
    for (let id in tasks) {
      const task = tasks[id];
      tasksList.push(task);
      templateTaskCard(task);
    }
    loadTasks();
    return tasksList;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
  }
}

/**
 * Loads all tasks, finds unique categories, renders tasks by category,
 * and applies color styling to assigned user initials.
 */
function loadTasks() {
  let categories = [...new Set(tasksList.map((t) => t.range))];
  for (let i = 0; i < categories.length; i++) {
    let category = categories[i];
    findTasksByCategory(category);
  }
  applyAssignedToColors();
}

function schwichtPlaceholderVisibility(task) {
  const range = task.range;
  if (categoryMap[range]) {
    const { container, placeholder } = categoryMap[range];
    if (task) placeholder.classList.add("hide");
    container.innerHTML += templateTaskCard(task);
  } else {
    console.warn(`Unknown category: ${task.range}`);
  }
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
    schwichtPlaceholderVisibility(task);
  }
}



function initiateBoard() {
  getAllTasks();
}

export {
  initiateBoard,
  findTasksByCategory,
  getAbbreviation,
  countSubtasks,
  countSubtasksDone,
  applyAssignedToColors,
  tasksList,
  getAllTasks
};

window.initiateBoard = initiateBoard;
window.findTasksByCategory = findTasksByCategory;
window.getAbbreviation = getAbbreviation;
window.countSubtasks = countSubtasks;
window.countSubtasksDone = countSubtasksDone;
window.applyAssignedToColors = applyAssignedToColors;
window.loadTasks = loadTasks;
