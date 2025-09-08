import { tasksList, loadTasks, clearAllColums } from "./board.js";   
const letterColors = { A: "#e57373", B: "#f06292", C: "#ba68c8", D: "#9575cd", E: "#7986cb", F: "#64b5f6", G: "#4fc3f7", H: "#4dd0e1", I: "#4db6ac", J: "#81c784", K: "#aed581", L: "#dce775", M: "#fff176", N: "#ffd54f", O: "#ffb74d", P: "#ff8a65", Q: "#a1887f", R: "#e67e22", S: "#8e44ad", T: "#34495e", U: "#16a085", V: "#27ae60", W: "#2980b9", X: "#8e44ad", Y: "#f39c12", Z: "#c0392b"};
let searchInput; 

let searchInputRef= window.innerWidth < 878 ? document.getElementById("searchValueMobile") : document.getElementById("searchValue");

searchInputRef?.addEventListener("focus", function(){
  searchInput = searchInputRef.value;
  clearAllColums();
  searchParticularTask(searchInput);
});

searchInputRef?.addEventListener("blur", function(){
  searchInput = searchInputRef.value;
  clearAllColums();
  searchParticularTask(searchInput);
});


/**
 * Searches a list of tasks by title, description, and category
 * @param {Array} tasks - Array of task objects
 * @param {string} keyword - The keyword to search for
 * @returns {Array} - Filtered list of tasks matching the keyword
 */
function searchTasks(tasks, keyword) {
  if (!keyword) return tasks;
  const lowerKeyword = keyword.trim().toLowerCase();
  return tasks.filter((task) => {
    const inTitle = task.title.toLowerCase().includes(lowerKeyword);
    const inDescription = task.description.toLowerCase().includes(lowerKeyword);
    const inCategory = task.category.toLowerCase().includes(lowerKeyword);
    return inTitle || inDescription || inCategory;
  });
}


/** * Searches for tasks based on user input and updates the task display.
 * @param {string} searchInput - The search input string.
 */
function searchParticularTask(searchInput) {
    searchInput = window.innerWidth < 878 ? document.getElementById("searchValueMobile").value : document.getElementById("searchValue").value;
    let resultSearch = searchTasks(tasksList, searchInput);
    clearAllColums();
    loadTasks(resultSearch);
}


/**
 *  Applies background colors to span elements within elements with the classes
 * ".option" and ".assigned-contact" based on the first letter of their text content.
 * The color is determined by the `letterColors` mapping; if no color is found,
 * a default color ("#000") is used.
 */
function applyAssignedToColors() {
  document.querySelectorAll(".asigned-to span").forEach((spantask) => {
    const firstLetter = spantask.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    spantask.style.backgroundColor = color;
  });
  document.querySelectorAll(".taskCardPopup ul li span").forEach((spanuser) => {
    const firstLetterUser = spanuser.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetterUser] || "#000";
    spanuser.style.backgroundColor = color;
  });
  document.querySelectorAll(".taskCard-header span").forEach((spancategory) => {
    const firstLetter = spancategory.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    spancategory.style.backgroundColor = color;
  });
  document.querySelectorAll(".already-assigned span").forEach((alreadyAssigned) => {
    const firstLetter = alreadyAssigned.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    alreadyAssigned.style.backgroundColor = color;
  });
  document.querySelectorAll(".option span").forEach((alreadyAssigned) => {
    const firstLetter = alreadyAssigned.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    alreadyAssigned.style.backgroundColor = color;
  });
}

/**
 *  Applies background colors to span elements within elements with the classes
 * ".option" and ".assigned-contact" based on the first letter of their text content.
 * The color is determined by the `letterColors` mapping; if no color is found,
 * a default color ("#000") is used.
 */
function applyAssignedToColorSpan(){
  document.querySelectorAll(".option span").forEach((alreadyAssigned) => {
    const firstLetter = alreadyAssigned.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    alreadyAssigned.style.backgroundColor = color;
  });
  document.querySelectorAll(".assigned-contact span").forEach((alreadyAssigned) => {
    const firstLetter = alreadyAssigned.textContent.trim().charAt(0).toUpperCase();
    const color = letterColors[firstLetter] || "#000";
    alreadyAssigned.style.backgroundColor = color;
  });
}

export{applyAssignedToColorSpan, applyAssignedToColors};

window.searchParticularTask = searchParticularTask;
window.applyAssignedToColors = applyAssignedToColors;
window.applyAssignedToColorSpan = applyAssignedToColorSpan;