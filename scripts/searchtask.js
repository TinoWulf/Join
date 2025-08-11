import { tasksList, applyAssignedToColors } from "./board.js";
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


window.searchParticularTask = searchParticularTask;