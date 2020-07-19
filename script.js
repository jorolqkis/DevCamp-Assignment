 var rows;
 var cols;
 var clicks = 0;
 var count = 0;
 var x11;
 var y11;
 var changedCount = 0;

 // Need 2D arrays. These are 1D
 let currGen = [rows];
 let nextGen = [rows];
 //Sets the grid size
 function setGrid() {
     rows = document.getElementById("x").value;
     cols = document.getElementById("y").value;
     createWorld();
     createGenArrays();
     initGenArrays();
 }
 // Selecting the input element and get its value
 function getInputValue() {
     x11 = document.getElementById("x1").value;
     y11 = document.getElementById("y1").value;
     document.getElementById("x11").innerHTML = x11;
     document.getElementById("y11").innerHTML = y11;
 }

 // Creates two-dimensional arrays
 function createGenArrays() {
     for (let i = 0; i < rows; i++) {
         currGen[i] = new Array(cols);
         nextGen[i] = new Array(cols);
     }

 }

 //Sets the values or arrays to 0 (red).
 function initGenArrays() {
     for (let i = 0; i < rows; i++) {
         for (let j = 0; j < cols; j++) {
             currGen[i][j] = 0;
             nextGen[i][j] = 0;
         }
     }
 }

 //Builds the table, row by row, column by column and cell by cell.
 function createWorld() {
     let world = document.querySelector('#world');
     let tbl = document.createElement('table');
     tbl.setAttribute('id', 'worldgrid');
     for (let i = 0; i < rows; i++) {
         let tr = document.createElement('tr');
         for (let j = 0; j < cols; j++) {
             let cell = document.createElement('td');
             cell.setAttribute('id', i + '_' + j);
             cell.setAttribute('class', 'red');
             cell.addEventListener('click', cellClick);
             tr.appendChild(cell);
         }
         tbl.appendChild(tr);
     }
     world.appendChild(tbl);
 }

 //To toggle the cells between alive and dead
 function cellClick() {
     let loc = this.id.split("_");
     let row = Number(loc[0]); //Get i
     let col = Number(loc[1]); //Get j
     // Toggle cell green or red
     if (this.className === 'green') {
         this.setAttribute('class', 'red');
         currGen[row][col] = 0;

     } else {
         this.setAttribute('class', 'green');
         currGen[row][col] = 1;

     }
 }

 function createNextGen() {
     for (row in currGen) {
         for (col in currGen[row]) {
             let neighbors = getNeighborCount(row, col);
             // Check the rules
             // If Green
             if (currGen[row][col] == 1) {
                 if (neighbors < 2 || neighbors == 4 || neighbors == 5 || neighbors > 6) {
                     nextGen[row][col] = 0;
                 } else if (neighbors == 2 || neighbors == 3 || neighbors == 6) {
                     nextGen[row][col] = 1;
                 }
             } else if (currGen[row][col] == 0) {
                 // If Red 
                 if (neighbors == 3 || neighbors == 6) {

                     nextGen[row][col] = 1; //changes to green
                 } else if (neighbors < 2 || neighbors == 4 || neighbors == 5 || neighbors > 6) {
                     nextGen[row][col] = 0; //stays red
                 }
             }

         }
     }
 }

 //Counts the number of neighbors for a given cell.
 function getNeighborCount(row, col) {

     let count = 0;
     let nrow = Number(row);
     let ncol = Number(col);

     // Make sure we are not at the first row
     if (nrow - 1 >= 0) {
         // Check top neighbor
         if (currGen[nrow - 1][ncol] == 1)
             count++;
     }
     // Make sure we are not in the first cell
     // Upper left corner
     if (nrow - 1 >= 0 && ncol - 1 >= 0) {
         //Check upper left neighbor
         if (currGen[nrow - 1][ncol - 1] == 1)
             count++;
     }
     // Make sure we are not on the first row last column
     // Upper right corner
     if (nrow - 1 >= 0 && ncol + 1 < cols) {
         //Check upper right neighbor
         if (currGen[nrow - 1][ncol + 1] == 1)
             count++;
     }
     // Make sure we are not on the first column
     if (ncol - 1 >= 0) {
         //Check left neighbor
         if (currGen[nrow][ncol - 1] == 1)
             count++;
     }
     // Make sure we are not on the last column
     if (ncol + 1 < cols) {
         //Check right neighbor
         if (currGen[nrow][ncol + 1] == 1)
             count++;
     }
     // Make sure we are not on the bottom left corner
     if (nrow + 1 < rows && ncol - 1 >= 0) {
         //Check bottom left neighbor
         if (currGen[nrow + 1][ncol - 1] == 1)
             count++;
     }
     // Make sure we are not on the bottom right
     if (nrow + 1 < rows && ncol + 1 < cols) {
         //Check bottom right neighbor
         if (currGen[nrow + 1][ncol + 1] == 1)
             count++;
     }
     // Make sure we are not on the last row
     if (nrow + 1 < rows) {
         //Check bottom neighbor
         if (currGen[nrow + 1][ncol] == 1)
             count++;
     }
     return count;
 }

 function updateCurrGen() {
     for (row in currGen) {
         for (col in currGen[row]) {
             // Update the current generation with
             // the results of createNextGen function
             currGen[row][col] = nextGen[row][col];
             // Set nextGen back to empty
             nextGen[row][col] = 0;
         }
     }
 }

 //Updates the visual display of the grid.
 function updateWorld() {
     let cell = '';
     for (row in currGen) {
         for (col in currGen[row]) {
             cell = document.getElementById(row + '_' + col);
             if (currGen[row][col] == 0) {
                 cell.setAttribute('class', 'red');
             } else {
                 cell.setAttribute('class', 'green');
             }
         }
     }
 }

 //Counts the number of made generations
 function onClick() {
     clicks += 1;
     document.getElementById("clicks").innerHTML = clicks;
 }

 //Counts the changed of a certain cell
 function setChanges(x11, y11) {
     let row = Number(x11);
     let col = Number(y11);
     if (currGen[row][col] != nextGen[row][col]) {
         changedCount++;
     }
     document.getElementById("changes").innerHTML = changedCount;
 }

 //Apllies the rules and generates the new table
 function evolve() {
     createNextGen(); //Apply the rules
     updateCurrGen(); //Set Current values from new generation
     updateWorld(); //Update the world view
     onClick();
     getInputValue();
     setChanges(x11, y11);
 }

 //Resets the table
 function resetWorld() {
     location.reload();
     changedCount = 0;
 }

 window.onload = () => {
     setGrid();

 }