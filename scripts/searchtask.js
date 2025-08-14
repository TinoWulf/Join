import { tasksList } from "./board.js";
import { templateTaskCard, } from "./templates.js";
let showSearchResult = document.getElementById("containerBoard");
let searchInput; 


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


function searchParticularTask() {
    searchInput = window.innerWidth < 878 ? document.getElementById("searchValueMobile").value : document.getElementById("searchValue").value;
    let resultSearch = searchTasks(tasksList, searchInput);
    showSearchResult.innerHTML = "";
    if(resultSearch.length>0){
    for (let taskindex in resultSearch) {
        const task = resultSearch[taskindex];
        showSearchResult.innerHTML += templateTaskCard(task);
        applyAssignedToColors();  
    }
    }else{
    showSearchResult.innerHTML += `<p style="color:red; font-size:20px;">the search result is empty there is not any task that match your search</p>`;
    }
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