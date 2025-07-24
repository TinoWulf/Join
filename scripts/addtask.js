        
          // Aufgaben
            // title  ----------------------------------------------------> date: 16.07
              // (all) show required css
              // description
                  // rot einbauen 
                    // Probleme: 
                        // reagiert nur beim enter-button
                        // text funktioniert nicht
            // due date --------------------------------------------------> date: 17.07
              // button mit onclick auf javascript 
                  // button nicht als clickpunkt fokussieren da ein bild darüber ist
                  // aktuelles datum einbauen mit value="${date}"
            // priority --------------------------------------------------> date: 18.07
              // Farbe dauerhaft bei dem jeweilig ausgewählten button
            // Assigned to -----------------------------------------------> date: 19.07
              // die Personen werden darunter angezeigt
              // Verbinung mit Contacts
            // Category --------------------------------------------------> date: 20.07
              // verschiebt den text darunter nach unten
            // subtasks --------------------------------------------------> date: 20.07
              // onclick fügt erste Task hinzu
              // image bevor drücken
              // image nach click drücken 
              // function yes and no button 
                // details:
                  // löschen
                  // bearbeiten
            // board css
                // nach create Task wird der div board "Task added to board" hochgeschoben und ich werde daraufhin zu board geführt wenige sekunden danach
        
              // ----------------------------------------------------------------------------------------------------------------
                  // --------------------------------------------------------------------------------Priority ---------------------
          let wert = document.querySelectorAll("#button-priority");
          
          wert.forEach(buttonclick => {
            buttonclick.addEventListener('click', () => {
              const priorityClick = buttonclick.getAttribute('data-value');
              console.log(buttonclick.getAttribute('data-value'));
              
              console.log(priorityClick);
              let priorityColor = "";

              if(priorityClick == "Urgent") {
                console.log("nun sind wir in urgent");
                priorityColor = document.getElementById("button-priority-urgent");
                priorityColor.style.backgroundColor = "red";
              } if (priorityClick == "Medium") {
                console.log("nun sind wir in medium"); 
                priorityColor = document.getElementById("button-priority-medium");
                priorityColor.style.backgroundColor = "yellow";
              } else {
                console.log("nun sind wir in low"); 
                priorityColor = document.getElementById("button-priority-low");
                priorityColor.style.backgroundColor = "green";
              }
            })
          });
            // Uncaught (in promise) ReferenceError: priorityClick is not defined

          // ------------------------------------------------------------------------------
        
        
        // --------------------------------------------------- show required --------------------------------------------------
            function requiredColorIfFilled() {
              let input = document.getElementById("required");
              if(input !== null && input.value === "") {
                input.style.borderColor = "red";
                empty = document.createElement("div"); //not working
                empty.id = 'text-required';
              } else {
                input.style.borderColor="#5d5dd8";
                let remove = document.getElementById("text-required");
                remove.remove();
              }
            }
            // -----------------------------------------due date input öffnen --------------------------------------------------
            function dueDateImage() {
              document.getElementById("dateimg").addEventListener("click", function() {
                document.getElementById("dateimg").showPicker();
              });
            }
            // --------------------------------------------- category --------------------------------------------------
            function openCategory() {
              console.log("you opened category");
            }

            // -------------------------------------------- subtasks --------------------------------------------------------------


