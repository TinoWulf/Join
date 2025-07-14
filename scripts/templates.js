import { countSubtasks, countSubtasksDone, getAbbreviation } from "./board.js";
/**
 * Generates the HTML template for a task card.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for the task card.
 */
function templateTaskCard(task) {
  return `
    <div class="taskCard" draggable="true" data-taskId = "${task.id}" ondragstart="startDragging(${task.id})" id="${task.id}" onclick ="openTaskDetail(${task.id})">
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


function templateTaskCardDetail(task){
  return `
  
          <div class="taskCardPopup" onclick="preventEvent(event)">
            <div class="taskCard-header">
              <span class="taskType">${task.category}</span>
              <img src="./assets/icons/iconoir_cancel.png"  alt="cancel" onclick="closePopUp(event)" class="show"/>
            </div>
            <h4>${task.title}</h4>
            <p class="taskCard-body description">
              ${task.description}
            </p>
            <p class="taskCard-body due-date">
              <span>Due Date: </span> <span>${task.dueDate}</span>
            </p>
            <p class="taskCard-body priority">
              <span>Priority: </span> <span class="priority-img">${capitalizeName(task.priority)} <img src="./assets/icons/${task.priority}.png" alt="" /></span>
            </p>
            <p class="asigned-to">Assigned To</p>
            <ul class="asigned-to-list">
              ${task.assignedTo.map((user) => `<li><span>${getAbbreviation(user.name)}</span>${capitalizeName(user.name)}</li>`).join("")}
            </ul>
            <div class="subtasks">
              <h5>Subtasks</h5>
              <section class="form-subtask">
              ${task.subtasks.map((subtask) => 
                
                `
                <div class="form-check">
                  <input type="checkbox" id="subtask" name="subtask" ${subtask.checked ? "checked" : ""}/>
                  <label for="subtask1">${subtask.title}</label>
                </div>

                `).join("")
                }
              </section>
            </div>
            <div class="taskPopupFooter">
              <p><img src="./assets/icons/delete.png" alt="delete" /><span>delete</span></p>
              <p><img src="./assets/icons/edit.png" alt="edit" /><span>edit</span></p>
            </div>
          </div>
  
  `;
}

export { templateTaskCard, templateTaskCardDetail};

window.templateTaskCard = templateTaskCard ;
window.templateTaskCardDetail = templateTaskCardDetail ;