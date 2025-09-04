import * as addTask from "./addtask.js";
import {escapeForInlineJS, setupPriorityButtons } from "./edittask.js";

window.getTaskData = addTask.getTaskData;
window.getUser = addTask.getUser;
window.setupPriorityButtons = setupPriorityButtons;
window.addSubstask = addTask.addSubstask;
window.getAssignedContactById = addTask.getAssignedContactById;
window.showContainerOnBoardAddTask = addTask.showContainerOnBoardAddTask;
window.showCategory = addTask.showCategory;
window.getEditedSubtask = addTask.getEditedSubtask;
window.modifySubtaskInEdited = addTask.modifySubtaskInEdited;
window.deleteSubtaskInEdited = addTask.deleteSubtaskInEdited;