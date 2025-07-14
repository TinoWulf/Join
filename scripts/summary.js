/**
 * Imports the necessary Firebase database functions and references.
 */
import { database, ref, get} from "./connection.js";
import { getAbbreviation} from "./board.js";


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


function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


const currentDate = new Date();
const currentHour = currentDate.getHours();

function getUserExits(currentHour){
  if (currentHour >= 5 && currentHour < 12) {
      return "Good morning,";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon,";
    } else if (currentHour >= 18 && currentHour < 24) {
      return "Good evening,";
    } else {
      return "Good night,";
    }
}

function getGuestUser(currentHour){
  if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 24) {
      return "Good evening";
    } else {
      return "Good night";
    }
}

const urlParams = new URLSearchParams(window.location.search);
const currentUserName = urlParams.get('name');
if (currentUserName && currentUserName.trim() !== '') {
  const loggedUser = capitalizeName(currentUserName.trim().toUpperCase());
  localStorage.setItem("userName", loggedUser);
}

let actualUser = localStorage.getItem("userName");
if (actualUser && actualUser !== 'null') {
  document.getElementById('initial-user').textContent = getAbbreviation(actualUser);
  document.getElementById('greetMessage').textContent = getUserExits(currentHour);
  document.getElementById('userName').textContent = actualUser;
} else {
  document.getElementById('initial-user').textContent = 'G';
  document.getElementById('greetMessage').textContent = getGuestUser(currentHour);
}

document.getElementById('summary').classList.add('active');



/**
 * Initializes the summary by fetching and displaying all task statistics.
 */
getAllTasksSummary();
