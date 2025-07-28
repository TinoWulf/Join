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
              <span>Due Date: </span> <span>${formatDueDate(task.dueDate, "numeric")}</span>
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
              <p onclick = "deleteTask(${task.id}, event)"><img src="./assets/icons/delete.png" alt="delete" /><span>delete</span></p>
              <p onclick="openEditTask(${task.id})"><img src="./assets/icons/edit.png" alt="edit" /><span>edit</span></p>
            </div>
          </div>
  
  `;
}


function toDoPlaceholderTemplate(){
  return `

    <div id="toDoTaskPlaceholder" class="placeholder show">
      No tasks To do
      </div>
  
  `;
}


function inProgressPlaceholderTemplate(){
  return `
    <div id="inProgressTaskPlaceholder" class="placeholder show">
      No tasks in progress
    </div>
  `;
}

function awaitReviewPlaceholderTemplate(){
  return `
    <div id="awaitReviewTaskPlaceholder" class="placeholder show">
      No tasks awaiting feedback
    </div>
  `;
}

function donePlaceholderTemplate(){
  return `
    <div id="doneTaskPlaceholder" class="placeholder show">
      No Task Done
    </div>
  `;
}


function templateEditTask(task){
  return `
  <script type="module" src="./scripts/edittask.js"></script>
     <div class="editTaskPopup">
            <div class="taskCard-header">
              <spa class="taskType"></spa>
              <img src="./assets/icons/iconoir_cancel.png"  alt="cancel" onclick="closePopUp(event)" class="show"/>
            </div>
          <label for="title" class="label-title">
              Title
              <input type="text" name="title" id="taskTitle" value="${task.title}" required>
          </label>
          <label for="description">
              Description
              <textarea name="description" id="taskDescription" cols="10" rows="4">${task.description}</textarea>
          </label>
          <label for="date" class="label-date">
              Due date
              <input type="date" name="date" id="dueDate" value="${task.dueDate}" required>
          </label>
          <label for="" class="label-priority">
              Priority
              <div class="add-task-priority">
                  <input type="hidden" name="priority" id="priorityInput" value="" />
                  <button type="submit" class="priority-button ${task.priority === 'urgent' ? 'urgent': '' } " data-priority="urgent"  id="priorityButtonUrgent">
                  Urgent<img src="./assets/icons/urgent.png" alt="" />
                  </button>
                  <button type="submit" class="priority-button ${task.priority === 'medium' ? 'medium': '' }" data-priority="medium"  id="priorityButtonMedium">
                  Medium <img src="./assets/icons/medium.png" alt="" />
                  </button>
                  <button type="submit" class="priority-button ${task.priority === 'low' ? 'low': '' }" data-priority="low"  id="priorityButtonLow">
                  Low <img src="./assets/icons/low.png" alt="" />
                  </button>
              </div>
          </label>
          <label for="assigned" id="assigned-to" class="label-assign">
              Assigned to
              <div class="drop-down-input" onclick="showContainerOnBoard()">
                <input name="assigned" id="assignedTo" value="Select contacts to assign" readonly/>
                <span onclick="showContainerOnBoard()"><img src="./assets/icons/drop-down.png" alt=""></span>
              </div>
              <form name="assigned" id="assigned" class="hide container-contact">
                
                
              </form>
              <div class="already-assigned" id="alreadyAssigned">
                ${task.assignedTo.map((user) => `<span>${getAbbreviation(user.name)}</span>`).join("")}
              </div>

          </label>
          <label for="subtasks" class="label-subtask" onclick="preventEvent(event)">
              Substaks
              <div class="drop-down-input">
                <input type="text" name="subtasks" id="subtask-input" placeholder="Add new Subtask">
                <span onclick="addSubstask()",onclick="preventEvent(event)"><img src="./assets/icons/plusbtngrey.png" alt=""></span>
              </div>
              <div id="subtaskListEdit">

              </div>
          </label>
          <div class="edit-button">
            <button class="btn-submit-change" onclick="getEditedTask(${task.id}, event)">Ok <img src="./assets/icons/check.png" alt=""></button>
          </div>
      </div>
  `;
}



function templateRenderContactOnBord(contact){
  return `
    <div class="option" onclick="getAssignedContactById(${contact.id})">
      <label for="${contact.id}"><span>${getAbbreviation(contact.name)}</span>${contact.name}</label>
      <input onclick="getAssignedContactById(${contact.id})" type="checkbox" id="${contact.id}" name="${contact.id}" value ="${contact.name}" data-id = "${contact.id} "/>
    </div>
  `;
}


export { templateTaskCard, templateTaskCardDetail,templateEditTask, toDoPlaceholderTemplate, inProgressPlaceholderTemplate, awaitReviewPlaceholderTemplate, donePlaceholderTemplate, templateRenderContactOnBord };

window.templateTaskCard = templateTaskCard ;
window.templateTaskCardDetail = templateTaskCardDetail ;
window.templateEditTask = templateEditTask ;
window.toDoPlaceholderTemplate = toDoPlaceholderTemplate ;
window.inProgressPlaceholderTemplate = inProgressPlaceholderTemplate ;
window.awaitReviewPlaceholderTemplate = awaitReviewPlaceholderTemplate ;
window.donePlaceholderTemplate = donePlaceholderTemplate ;
window.templateRenderContactOnBord = templateRenderContactOnBord ;