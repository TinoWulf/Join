/**
 * Imports the necessary Firebase database functions and references.
 */
import { database, ref, get } from "./connection.js";


/**
 * Stores the list of tasks retrieved from the database.
 * @type {Array}
 */
let tasksList = [];


/**
 * Fetches all tasks from the Firebase database, updates the global tasksList,
 * calculates summary statistics, and updates the corresponding DOM elements.
 * If an error occurs, it is logged to the console.
 *
 * @async
 * @function getAllTasksSummary
 * @returns {Promise<void>}
 */
async function getAllTasksSummary() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (!snapshot.exists()) return;
    const tasks = snapshot.val();
    tasksList = Object.values(tasks); 
    const {
      tasksNumber,doneTasksNumber,inProgressTasksNumber,toDoTasksNumber,awaitReviewTasksNumber
    } = getAllNumber(tasksList);
    document.getElementById("totalTasks").innerText = tasksNumber;
    document.getElementById("doneTasks").innerText = doneTasksNumber;
    document.getElementById("tasksInProgress").innerText = inProgressTasksNumber;
    document.getElementById("toDoTasks").innerText = toDoTasksNumber;
    document.getElementById("tasksAwaitFeedbacks").innerText = awaitReviewTasksNumber;
    document.getElementById("urgentTasks").innerText = tasksList.filter(task => task.priority == "urgent").length;
  } catch (error) {
    console.error("Error retrieving tasks:", error);
  }
}


/**
 * Calculates the number of tasks in each category from the provided tasks list.
 *
 * @function getAllNumber
 * @param {Array} tasksList - The list of task objects.
 * @returns {Object} An object containing the total number of tasks and the count for each category.
 *   - tasksNumber: Total number of tasks
 *   - doneTasksNumber: Number of tasks with range 'done'
 *   - inProgressTasksNumber: Number of tasks with range 'inProgress'
 *   - toDoTasksNumber: Number of tasks with range 'toDo'
 *   - awaitReviewTasksNumber: Number of tasks with range 'awaitReview'
 */
function getAllNumber(tasksList) {
  return {
    tasksNumber: tasksList.length,
    doneTasksNumber: tasksList.filter(task => task.range === "done").length,
    inProgressTasksNumber: tasksList.filter(task => task.range === "inProgress").length,
    toDoTasksNumber: tasksList.filter(task => task.range === "toDo").length,
    awaitReviewTasksNumber: tasksList.filter(task => task.range === "awaitReview").length,
  };
}


/**
 * Initializes the summary by fetching and displaying all task statistics.
 */
getAllTasksSummary();
