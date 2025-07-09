import { countSubtasks, countSubtasksDone, getAbbreviation } from "./board.js";
/**
 * Generates the HTML template for a task card.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for the task card.
 */
function templateTaskCard(task) {
  return `
    <div class="taskCard" draggable="true" data-taskId = "${task.id}" ondragstart="startDragging(${task.id})" id="${task.id}">
      <div class="taskCard-header">
        <span class="taskType">${task.category}</span>
        <img src="./assets/icons/iconoir_cancel.png" alt="cancel" class="hide" />
      </div>
      <h4>${task.title}</h4>
      <p class="taskCard-body">${task.description}</p>
      <div class="progress">
        <progress id="subtask" value="${(countSubtasksDone(task) / countSubtasks(task)) * 100}" max="100"> % </progress>
        <label for="subtask">${countSubtasksDone(task)}/${countSubtasks(task)}Subtasks</label>
      </div>
      <div class="taskCard-footer">
        <div class="asigned-to">
            ${task.assignedTo.map((user) => `<span>${getAbbreviation(user.name)}</span>`).join("")}
        </div><img src="./assets/icons/${task.priority}.png" alt="" class="taskGrade">
      </div>  
    </div>
  `;
}

export { templateTaskCard };

window.templateTaskCard = templateTaskCard ;