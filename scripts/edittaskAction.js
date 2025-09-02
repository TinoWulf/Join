let imgIconsAddsubtask  = document.getElementById('imgIcons');
let addSubtaskRef  = document.getElementById('addSubtask');
let inputAddSubtask = addSubtaskRef.querySelector('input');


inputAddSubtask.addEventListener('focus', function(){
    imgAddsubtaskPlus.hidden = true;
    imgIconsAddsubtask.classList.add('show-icons');
})

inputAddSubtask.addEventListener("blur", () => {
  if (!inputAddSubtask.value.trim()) {
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
  }
});


/**
 * this function hide the input for edit subtask after this one is already edited.
 */
function deleteSubtaskInput(){
    inputAddSubtask.value = '';
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
}

window.deleteSubtaskInput = deleteSubtaskInput;

