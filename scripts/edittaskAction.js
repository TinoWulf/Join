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

function deleteSubtaskInput(){
    inputAddSubtask.value = '';
    imgAddsubtaskPlus.hidden = false;
    imgIconsAddsubtask.classList.remove('show-icons');
}

console.log(addSubtaskRef);
console.log("Hello WORLD");

window.deleteSubtaskInput = deleteSubtaskInput;
