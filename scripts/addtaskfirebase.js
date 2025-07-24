
      import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
      const firebaseConfig = {
        apiKey: "AIzaSyBTNhKQ8xLEQmVFwv9O3SoAB4C8qFHdCVY",
        authDomain: "add-task-c4c0d.firebaseapp.com",
        databaseURL: "https://add-task-c4c0d-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "add-task-c4c0d",
        storageBucket: "add-task-c4c0d.firebasestorage.app",
        messagingSenderId: "375723460761",
        appId: "1:375723460761:web:d13ea9187e4b298f0b1008",
        measurementId: "G-086L39VXMV"
      };
      
      const taxApp = initializeApp(firebaseConfig);
      import {getDatabase,ref,set} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
      const databasetaskUrl = getDatabase(taxApp);
      
      
      
      async function newElement() {
        const addTaskForm = document.getElementById("add-task-form");
        if(!addTaskForm) return;
        
        
        
        addTaskForm.addEventListener("submit", async (a) => {
          const databasetask = ref(databasetaskUrl, "tasks");
          a.preventDefault();
          
          await set(databasetask, priorityClick, {
            assign: document.getElementById("assign").value,
            category: document.getElementById("category").value,
            description: document.getElementById("description").value,
            subtasks: document.getElementById("subtasks").value,
            title: document.getElementById("title").value,
            zeroDate: document.getElementById("date").value,
            priority: priorityClick
          })});
        }

      newElement();
