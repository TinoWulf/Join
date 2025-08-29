/**
 * Imports the necessary Firebase database functions and references.
 */
import { database, ref, get} from "./connection.js";
import { getAbbreviation} from "./board.js";


/**
 * Stores the list of tasks retrieved from the database.
 * @type {Array} Stores the list of tasks retrieved from the database.
 * @type {Object} Stores the number of tasks retrieved from the database in different categories.
 */
let tasksList = [];
let allNummer = {};


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
    getNearestTask(tasksList);
    allNummer = getAllNumber(tasksList);
    getNumberInSummary(allNummer);
    document.getElementById("urgentTasks").innerText = tasksList.filter(task => task.priority == "urgent").length;
  } catch (error) {
    openErrorPage();
  }
}


/**
 * This function updates the inner text of various elements in the summary section and updates the DOM elements with the respective counts.
 * @param {Object} allNummer An object containing the total number of tasks and the count for each category.
 */

function getNumberInSummary(allNummer){
  document.getElementById("totalTasks").innerText = allNummer.tasksNumber;
  document.getElementById("doneTasks").innerText = allNummer.doneTasksNumber;
  document.getElementById("tasksInProgress").innerText = allNummer.inProgressTasksNumber;
  document.getElementById("toDoTasks").innerText = allNummer.toDoTasksNumber;
  document.getElementById("tasksAwaitFeedbacks").innerText = allNummer.awaitReviewTasksNumber;
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
greetMobile();
getAllTasksSummary();


/**
 * Capitalizes the first letter of each word in a given name string.
 *
 * @param {string} name - The name string to capitalize.
 * @returns {string} The capitalized name string.
 */
function capitalizeName(name) {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


const currentDate = new Date();
const currentHour = currentDate.getHours();


/**
 * Finds the nearest upcoming task from a list of tasks based on their due dates,
 * updates the inner text of the element with ID "upComingDeadline" to display the formatted due date,
 * and returns the formatted due date string. If there are no upcoming tasks, returns null.
 *
 * @param {Array<{ dueDate: string }>} tasksList - The list of task objects, each containing a dueDate property.
 * @returns {string|null} The formatted due date of the nearest upcoming task, or null if none exist.
 */
function getNearestTask(tasksList) {
  const nextUrgentTask = document.getElementById("upComingDeadline");
  const today = new Date();
  const urgentTasks = tasksList.filter(task => new Date(task.dueDate) >= today);
  if (urgentTasks.length === 0) return  nextUrgentTask.innerText = "No Upcoming tasks";
  urgentTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  return nextUrgentTask.innerText =  formatDueDate(urgentTasks[0].dueDate, "long"); 
}


/**
 * Returns a greeting message based on the provided hour of the day.
 *
 * @param {number} currentHour - The current hour in 24-hour format (0-23).
 * @returns {string} A greeting message: "Good morning,", "Good afternoon,", "Good evening,", or "Good night,".
 */
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


/**
 * Returns a greeting message based on the provided hour of the day.
 *
 * @param {number} currentHour - The current hour in 24-hour format (0-23).
 * @returns {string} A greeting message: "Good morning", "Good afternoon", "Good evening", or "Good night".
 */
function getGuestUser(currentHour){
  if (currentHour >= 5 && currentHour < 12) {
      return "Good morning!";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon!";
    } else if (currentHour >= 18 && currentHour < 24) {
      return "Good evening!";
    } else {
      return "Good night!";
    }
}


const urlParams = new URLSearchParams(window.location.search);
const currentUserName = urlParams.get('name');
if (currentUserName && currentUserName.trim() !== '') {
  const loggedUser = capitalizeName(currentUserName.trim().toUpperCase());
  localStorage.setItem("userName", loggedUser);
  actualUser = loggedUser;
}


document.addEventListener('DOMContentLoaded', function(){

  if (actualUser === 'Guest' ) {
    document.getElementById('greetMessage').textContent = getGuestUser(currentHour);
  } else if( actualUser && actualUser !== 'Guest') {
    document.getElementById('greetMessage').textContent = getUserExits(currentHour);
    document.getElementById('userName').textContent = actualUser;
  }else{
    window.location.href = `login.html`;
  }

})


function greetMobile(){
  if( window.innerWidth < 876 ){
    document.getElementById('greetMobile').classList.add('show');
    document.getElementById('boardSummary').classList.add('hide');
    document.getElementById('navSummary').classList.add('hide');
    setTimeout(()=>{
      document.getElementById('greetMobile').classList.remove('show');
      document.getElementById('boardSummary').classList.remove('hide');
      document.getElementById('navSummary').classList.remove('hide');
    }, 1500);
  }
}


export{capitalizeName, getUserExits, getGuestUser, greetMobile};

window.getGuestUser = getGuestUser;
window.getUserExits = getUserExits;

