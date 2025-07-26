document.addEventListener('DOMContentLoaded', function() {
  function activeNavItem(){
    document.getElementById('board').classList.remove('active');
    document.getElementById('contacts').classList.remove('active');
    document.getElementById('addtask').classList.add('active');
    document.getElementById('summary').classList.remove('active');
  }
  activeNavItem();
});