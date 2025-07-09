import { database, ref, get } from "../connection.js";

let tasksList = [];

async function getAllTasksSummary() {
  const tasksRef = ref(database, "tasks");
  try {
    const snapshot = await get(tasksRef);
    if (!snapshot.exists()) return;
    const tasks = snapshot.val();
    tasksList = Object.values(tasks); // cleaner than manual loop
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

function getAllNumber(tasksList) {
  return {
    tasksNumber: tasksList.length,
    doneTasksNumber: tasksList.filter(task => task.range === "done").length,
    inProgressTasksNumber: tasksList.filter(task => task.range === "inProgress").length,
    toDoTasksNumber: tasksList.filter(task => task.range === "toDo").length,
    awaitReviewTasksNumber: tasksList.filter(task => task.range === "awaitReview").length,
  };
}

getAllTasksSummary();
