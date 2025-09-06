import { countSubtasks, countSubtasksDone, getAbbreviation } from "./board.js";
/**
 * Generates the HTML template for a task card.
 * @param {Object} task - The task object.
 * @returns {string} The HTML string for the task card.
 */
function templateTaskCard(task) {
  return `
    <div class="taskCard" draggable="true" data-taskId = "${task.id}" ondragstart="startDragging(${task.id})" id="${task.id}" onclick ="openTaskDetail(${task.id})">
      <div class="taskCard-header" id="task${task.id}">
        <span class="taskType">${task.category}</span>
        <div class="move-mobile-task hide" id="moveTaskMobile">
          <h5>Move To:</h5>
          <ul>
            <li onclick="moveTo(${task.id}, 'toDo');preventEvent(event)" class="${task.range === "toDo"  ? "hide"  : " "}">- ToDo</li>
            <li onclick="moveTo(${task.id}, 'inProgress');preventEvent(event)" class="${task.range === "inProgress"  ? "hide"  : " "}">- In Progress</li>
            <li onclick="moveTo(${task.id}, 'awaitReview');preventEvent(event)" class="${task.range === "awaitReview"  ? "hide"  : " "}" >- Await Feedback</li>
            <li onclick="moveTo(${task.id}, 'done');preventEvent(event) " class="${task.range === "done"  ? "hide"  : " "}"  >- Done</li>
          </ul>
        </div>
        <img src="${task.range === "done"  ? "./assets/icons/up.png"  : task.range === "toDo" ? "./assets/icons/down.png" : "./assets/icons/up-down.png"}" alt="cancel" class="move-task-mobile" onclick="openMoveTaskMobile(${task.id}, event)" />
      </div>
      <h4>${task.title}</h4>
      <p class="taskCard-body task-description">${task.description}</p>
      ${task.subtasks?.length>0 ? 
        `
          <div class="progress">
            <progress id="subtask" value="${(countSubtasksDone(task) / countSubtasks(task)) * 100}" max="100"> % </progress>
            <label for="subtask">${countSubtasksDone(task)}/${countSubtasks(task)}Subtasks</label>
          </div>
        `
        : ''
    }
      
      <div class="taskCard-footer">
        <div class="asigned-to" id="assignedContactTask">
            ${
              task.assignedTo?.length > 0 
                ? (() => {
                    const visibleCount = 4;
                    const users = task.assignedTo;
                    const visibleUsers = users.slice(0, visibleCount);
                    const hiddenCount = users.length - visibleCount;
                    const spans = visibleUsers.map(user => `<span>${getAbbreviation(user.name)}</span>`);
                    if (hiddenCount > 0) {
                      spans.push(`<span class="more-users">+${hiddenCount}</span>`);
                    }
                    return spans.join("");
                  })()
                : ''
              }
        </div><img src="./assets/icons/${task.priority}.png" alt="" class="taskGrade">
      </div>  
    </div>
  `;
}


/**
 * render an HTML template for a task card with all informations.
 * @param {*} task  The task object.
 * @returns The HTML string for the task card.
 */
function templateTaskCardDetail(task){
  return `
  
          <div class="taskCardPopup" onclick="preventEvent(event)">
            <div class="taskCard-header close-header">
              <span class="taskType">${task.category}</span>
              <span class="close-span"><img src="./assets/icons/iconoir_cancel.png"  alt="cancel" onclick="closePopUp(event)" class="show"/></span>
            </div>
          <div class="edit-container">
            <h4>${task.title}</h4>
            <p class="taskCard-body description task-description">
              ${task.description}
            </p>
            <p class="taskCard-body due-date">
              <span>Due Date: </span> <span>${formatDueDate(task.dueDate, "numeric")}</span>
            </p>
            <p class="taskCard-body priority">
              <span>Priority: </span> <span class="priority-img">${capitalizeName(task.priority)} <img src="./assets/icons/${task.priority}.png" alt="" /></span>
            </p>
            ${task.assignedTo?.length > 0 ?
                `<p class="asigned-to">Assigned To</p>`
                : ''}
            <ul class="asigned-to-list">
              ${task.assignedTo?.length>0 ? task.assignedTo.map((user) => `<li><span>${getAbbreviation(user.name)}</span>${capitalizeName(user.name)}</li>`).join(""): ''}
            </ul>
            <div class="subtasks">
              ${task.subtasks?.length > 0 ?
                `<h5>Subtasks</h5>`
                : ''}
              <section class="form-subtask" id="subtask-form">
              ${task.subtasks?.length > 0 ? task.subtasks.map((subtask, index) => 
                
                `
                <div class="form-check">
                  <input type="checkbox" name="subtask${index}" value="${subtask.title}" data-index ="${index}"  ${subtask.checked ? "checked" : ""}/>
                  <label for="subtask${index}">${subtask.title}</label>
                </div>

                `).join("")
                : ''
                }
              </section>
            </div>
          </div>
            <div class="taskPopupFooter show-footer">
              <p onclick = "deleteTask(${task.id}, event)" class="delete-icon"><img src="./assets/icons/deletegrey.png" alt="delete" /></p>
              <p onclick="openEditTask(${task.id}); getEditedSubtask(${task.id})" class="edit-icon"><img src="./assets/icons/editgrey.png" alt="edit" /></p>
            </div>
          </div>
  
  `;
}


/**
 * Generates an HTML template for the "No Task to do" placeholder.
 *
 * @returns {string} The HTML string for the todo task placeholder element.
 */
function toDoPlaceholderTemplate(){
  return `

    <div id="toDoTaskPlaceholder" class="placeholder show">
      No tasks Todo
      </div>
  
  `;
}


/**
 * Generates an HTML template for the "No tasks in progress" placeholder.
 *
 * @returns {string} The HTML string for the in Progress task placeholder element.
 */
function inProgressPlaceholderTemplate(){
  return `
    <div id="inProgressTaskPlaceholder" class="placeholder show">
      No tasks in Progress
    </div>
  `;
}


/**
 * Generates an HTML template for the "No tasks awaiting feedback" placeholder.
 *
 * @returns {string} The HTML string for the await review task placeholder element.
 */
function awaitReviewPlaceholderTemplate(){
  return `
    <div id="awaitReviewTaskPlaceholder" class="placeholder show">
      No tasks Awaiting Feedback
    </div>
  `;
}


/**
 * Generates an HTML template for the "No Task Done" placeholder.
 *
 * @returns {string} The HTML string for the done task placeholder element.
 */
function donePlaceholderTemplate(){
  return `
    <div id="doneTaskPlaceholder" class="placeholder show">
      No Task Done
    </div>
  `;
}


/**
 * render an HTML template of the detail of a task
 * @param {*} task task object
 * @returns 
 */
function templateEditTask(task){
  return `
  <script type="module" src="./scripts/edittaskAction.js"></script>
     <div class="editTaskPopup container-edit" onclick="preventEvent(event)">
            <div class="taskCard-header close-header edit-header">
              <spa class="taskType"></spa>
              <span class="close-span"><img src="./assets/icons/iconoir_cancel.png"  alt="cancel" onclick="closePopUp(event)" class="show"/></span>
            </div>
        <div class="edit-container">
          <label for="title" class="label-title">
              Title
              <input type="text" class="" name="title" id="taskTitle" value="${task.title}" required>
              <p class="error-message hide" id="errorTitle">this field can not be empty</p>
          </label>
          <label for="description">
              Description
              <textarea name="description" id="taskDescription" cols="10" rows="4">${task.description}</textarea>
          </label>
          <label for="date" class="label-date">
              Due date
              <input type="date" class="" name="date" id="dueDate" value="${task.dueDate}" required>
              <p class="error-message hide" id="errorDate">this Date alredy passed</p>
          </label>
          <label for="" class="label-priority">
              Priority
              <div class="add-task-priority">
                  <input type="hidden" name="priority" id="priorityInput" value="" />
                  <button type="submit" class="priority-button"  data-priority="urgent"  id="priorityButtonUrgent">
                  Urgent<img src="./assets/icons/urgent.png" alt="" />
                  </button>
                  <button type="submit" class="priority-button"  data-priority="medium"  id="priorityButtonMedium">
                  Medium <img src="./assets/icons/medium.png" alt="" />
                  </button>
                  <button type="submit" class="priority-button"  data-priority="low"  id="priorityButtonLow">
                  Low <img src="./assets/icons/low.png" alt="" />
                  </button>
              </div>
          </label>
          <label for="assigned" id="assigned-to" class="label-assign">
              Assigned to
              <div class="drop-down-input" onclick="showContainerOnBoard(${task.id}, event)">
                <input name="assigned" id="assignedTo" value="Select contacts to assign" readonly/>
                <span onclick="showContainerOnBoard(${task.id}, event)"><img src="./assets/icons/drop-down.png" alt=""></span>
              </div>
              <form name="assigned" id="assigned" class="hide container-contact">
                
                
              </form>
              <div class="already-assigned" id="alreadyAssigned">
                ${
                    task.assignedTo?.length > 0 
                      ? (() => {
                          const visibleCount = 6;
                          const users = task.assignedTo;
                          const visibleUsers = users.slice(0, visibleCount);
                          const hiddenCount = users.length - visibleCount;
                          const spans = visibleUsers.map(user => `<span>${getAbbreviation(user.name)}</span>`);
                          if (hiddenCount > 0) {
                            spans.push(`<span class="more-users">+${hiddenCount}</span>`);
                          }
                          return spans.join("");
                        })()
                      : ''
                    }
              </div>

          </label>
          <label for="subtasks" class="label-subtask" onclick="preventEvent(event)">
              Substaks
              <div class="drop-down-input" id="addSubtask">
                <input type="text" name="subtasks" id="subtask-input" placeholder="Add new Subtask">
                <div class="img-icons" id="imgIcons">
                  <span class="delete-icon" onclick="deleteSubtaskInput()">
                      <img src="./assets/icons/close.png"alt="search icon" />
                  </span>
                  <span class="check-icon" onclick="addSubstask(); deleteSubtaskInput()">
                      <img src="./assets/icons/checkgrey.png" alt="search icon" />
                  </span>
                </div>
                <span onclick="addSubstask()",onclick="preventEvent(event)" class="img-addsubtask"><img src="./assets/icons/plusbtngrey.png" alt=""></span>
              </div>
              <p id="errorSubtask" class="error-message error-subtask"></p>
              <div id="subtaskListEdit" class="subtask-listes-edit">
              ${task.subtasks?.length > 0 ? task.subtasks.map((subtask, index) => 
                `<div class="subtask-item">
                    <li name="subtask${index}" data-index ="${index}">${subtask.title}</li>
                    <div class="img-icons"><span><img src="./assets/icons/delete.png" alt="delete" /></span><span onclick="getEditedSubtask()"><img src="./assets/icons/edit.png" alt="edit" /></span></div>
                  </div>
                `).join("")
                : ''
                
                }
              </div>
          </label>
        </div>
          <div class="edit-button">
            <button class="btn-submit-change" onclick="getEditedTask(${task.id});renderError()">Ok <img src="./assets/icons/check.png" alt=""></button>
          </div>
      </div>
    <script type="module" defer src="./scripts/edittask.js"></script>

  `;
}


/**
 * render an  HTML template of the contact in the add task form or in edit task form
 * @param {contact} contact  contact object
 * @param {boolean} contactIsAssignedToTask  if the contact is assigned to the task
 * @returns 
 */
function templateRenderContactOnBord(contact, contactIsAssignedToTask){
  return `
    <div class="option ${contactIsAssignedToTask ? 'background-option' : ''}" onclick="getAssignedContactById(${contact.id}, event)">
      <label for="${contact.id}"><span>${getAbbreviation(contact.name)}</span>${contact.name}</label>
      <input type="checkbox" id="${contact.id}" name="${contact.id}" value ="${contact.name}" data-id = "${contact.id}"  ${contactIsAssignedToTask ? 'checked' : ''}/>
    </div>
  `;
}

function templateAddTaskInBoard(){
  return `
    <link rel="stylesheet" href="./styles/add-task-board.css">
    <link rel="stylesheet" href="./styles/add-task2.css">
    <section class="main-addtask" id="addTaskContain">
        <h1 class="add-task-header">Add Task</h1>
    
        <div id="add-task-form" class="add-task-form">
            <div class="add-left-side">
                <label for="title" class="label-title">
                    <p>Title <span class="star">*</span></p>
                    <div class="input-title" id="titleContain">
                        <input id="taskTitle" class="outline" type="text" name="title" placeholder="Enter a title" required>
                    </div>
                    <p class="error-message hide" id="errorTitle">This field is required</p>
                </label>
                <label for="description" class="label-textarea">
                    Description
                    <div class="input-textarea">
                        <textarea id="taskDescription" name="description" class="textarea" class="description-area" id="description" rows="5" cols="100" placeholder="Enter a Description"></textarea>
                    </div>
                </label>
                <label for="date" class="label-date">
                    <p>Due date <span class="star">*</span></p>
                    <div class="input-date" id="dateContain">
                        <input   class="required outline" type="date" id="dueDate" name="date" required placeholder="dd/mm/yyyy" /> 
                    </div>
                    <p class="error-message hide" id="errorDate">This field is required</p>
                </label>
            </div>
            <div class="separator"></div>
            <div class="add-right-side">
                <label for="priority" class="label-priority">
                    Priority
                    <div class="button-priority-container" id="">
                        <input type="hidden" name="priority" id="priorityInput" value="" />
                        <button type="submit"  class="priority-button" id="priorityButtonUrgent" data-priority="urgent">
                            Urgent
                            <img class="priority-img" src="./assets/icons/urgent.png" id="imgUrgent">
                        </button>
                        <button type="submit" class="priority-button" id="priorityButtonMedium" data-priority="medium">
                            Medium
                            <img class="priority-img" src="./assets/icons/medium.png" id="imgMedium">
                        </button>
                        <button type="submit"  class="priority-button" id="priorityButtonLow" data-priority="low">
                            low
                            <img class="priority-img" src="./assets/icons/low.png" id="imgLow">
                        </button>
                    </div>
                </label>
                <label for="assigned" id="assigned-to" class="label-assignto">
                    Assigned to
                    <div class="drop-down-input" onclick="showContainerOnBoardAddTask(event)" id="assignedDropDown">
                        <input name="assigned" id="assignedTo" placeholder="Select contacts to assign" readonly/>
                        <span><img src="./assets/icons/drop-down.png" alt=""></span>
                    </div>
                    <form name="assigned" id="assigned" class="hide container-contact">
                        
                        
                    </form>
                </label>
                <div class="assigned-contact" id="assignedContact">

                </div>
                
                <label for="category" class="label-category" id="labelCategory">
                    <p>Category <span class="star">*</span></p>
                    <div class="drop-down-input" onclick="getCategory(event)" id="categoryContain">
                        <input type="text" placeholder="Select task category" readonly id="categoryInput">
                        <span onclick="getCategory(event)"><img class="arrow-drop-down-img" src="./assets/icons/arrow_drop_down.png"></span>
                    </div>
                    <div id="category" class="category hide">
                        <option value="User Story" onclick="showCategory()">User Story</option>
                        <option value="Technical Task" onclick="showCategory()">Technical Task</option>
                        <option value="Development" onclick="showCategory()">Developement</option>
                        <option value="Maketing" onclick="showCategory()">Maketing</option>
                    </div>
                    <p class="error-message hide" id="errorCat">This field is required</p>
                </label>
                <label for="subtasks" class="label-subtask subbtask-margin" id="labelSubtask">Subtasks
                    <div class="drop-down-input" id="addSubtask">
                        <input type="text" name="subtasks" id="subtask-input" placeholder="Add new Subtask" class="subtask-add">
                        <div class="img-icons" id="imgIcons">
                            <span class="delete-icon" onclick="deleteSubtaskInput()">
                                <img src="./assets/icons/close.png"alt="search icon" />
                            </span>
                            <span class="check-icon" onclick="addSubstask(); deleteSubtaskInput()">
                                <img src="./assets/icons/checkgrey.png" alt="search icon" />
                            </span>
                        </div>
                        <span onclick="addSubstask()" class="img-addsubtask"><img src="./assets/icons/plusbtngrey.png" alt=""></span>
                    </div>
                </label>
                <div id="subtaskListEdit" class="subtask-listes">

                </div>
            </div>
        </div>
        <div class="add-task-form-footer">
            <p><span class="star">*</span> This field is required</p>
            <div class="button-footer-container">
                <button type="reset" class="cancel-button" id="resetButton">Clear
                        <img class="button-img" src="./assets/icons/iconoir_cancel.png">
                </button>
                <button type="submit" class="create-task-button" onclick="getTaskData()" id="addTask">
                    Create Task
                    <img class="button-img" src="./assets/icons/check.png">
                </button>
            </div>
        </div>
        <div id="taskMessage">

        </div>
        <span class="this-list-is-for-test"></span>
    </section>
  `;
}
//onclick="getTaskData()" onclick="getCategory(event)"   

export { templateTaskCard, templateTaskCardDetail,templateEditTask, toDoPlaceholderTemplate, inProgressPlaceholderTemplate, awaitReviewPlaceholderTemplate, donePlaceholderTemplate, templateRenderContactOnBord, templateAddTaskInBoard };

window.templateTaskCard = templateTaskCard ;
window.templateTaskCardDetail = templateTaskCardDetail ;
window.templateEditTask = templateEditTask ;
window.toDoPlaceholderTemplate = toDoPlaceholderTemplate ;
window.inProgressPlaceholderTemplate = inProgressPlaceholderTemplate ;
window.awaitReviewPlaceholderTemplate = awaitReviewPlaceholderTemplate ;
window.donePlaceholderTemplate = donePlaceholderTemplate ;
window.templateRenderContactOnBord = templateRenderContactOnBord ;
window.templateAddTaskInBoard = templateAddTaskInBoard ;