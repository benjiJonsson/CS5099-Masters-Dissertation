/* 
// Run Board through DEMYSTIFY to determine difficulty based on MUSes
// ---------------------------------------------------------

1. Save Sudoku board to .param file
2. Call/Use DEMYSTIFY algorithm in Python 
3. Save JSON output to file in this directory 
4. Fetch the JSON data and assign it to an object
5. Extract Largest MUSSize, SUM of MUS sizes, Empty cell count
6. Present starting puzzle, solution, grade MUS metrics, and 
   grade formula in Board Storage. 
*/

const fs = require('fs');

// Saving Sudoku board
// ---------------------------------------------------------

// Import for performance analysis.
//const {easy_board, medium_board, hard_board, very_hard_board, evil_board} = require('./Grade_Testing.js');

// Import for Miracle Sudoku 
//const {startingSudokuBoard, populatedSudokuBoard} = require('../MiracleSudoku/Miracle.js');

// Import
const {startingSudokuBoard, populatedSudokuBoard} = require('./Simple_Backtracking.js');

// Set board equal to starting Sudoku
var board = startingSudokuBoard;

function saveStartingBoard(){
  /* Function to save the populated board to a .param file
  */

  // Setting board save type so that it can be read by DEMYSTIFY 
  const content = `language ESSENCE' 1.0

  letting fixed be 
  [
    ${board.map(function(row) { return `    [${row.join(',')}]` }).join(',\n')}
  ]`;

  // Saving the board to 'Saved Boards' file. 
  fs.writeFile('../TemporaryStorage/final_board.param', content, err => {
      if (err) {
          console.error('Error saving file:', err);
      } else {
          console.log('Final board saved successfully!');
      }
  });

}

// Reference: Saving File in JavaScript
// https://code.tutsplus.com/how-to-save-a-file-with-javascript--cms-41105t
// Reference: Joinning Arrays, line 40
// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-257.php

// Save starting Board
saveStartingBoard(board);


function arrayToString(){
  /*
  Function to Convert Board Array to a string
  */

  let boardString = '';
  for(let i = 0; i < 9; i++){
    for(let j = 0; j < 9; j++){
      boardString += `${board[i][j]}`;
    }
  }
  return boardString;
}

const boardString = arrayToString(board);
console.log(boardString);

// Call DEMYSTIFY & Save JSON Ouput
// ---------------------------------------------------------
const { spawn } = require('child_process');

var call_demystify = function() {
  /*
  Function to run the DEMYSTIFY solving algorihtm based on MUSes. 
  Note: To run on your specific desktop, you need to change the locations of the python
  script and terminal inputs to where teh files are saved on your computer. 
  Note: Chnage sudoku.eprime to miracle.eprime for miracle sudoku solving (line 96)
  */

  const pythonScript = '/Users/benjonsson/Desktop/Masters/CS5099/Code/demystify/demystify';
  const terminalInput = [
    pythonScript,
    '--eprime',
    '/Users/benjonsson/Desktop/Masters/CS5099/Code/demystify/eprime/sudoku.eprime',
    '--eprimeparam',
    '/Users/benjonsson/Desktop/Masters/CS5099/Code/MastersThesis/TemporaryStorage/final_board.param',
    '--json',
    `${boardString}.json`
  ];

  // Spawn a child process 
  const demystify_python = spawn('python3', terminalInput, { cwd: '/Users/benjonsson/Desktop/Masters/CS5099/Code/MastersThesis/DemystifyOutput' });

  // Log DEMYSTIFY error to console if an issue occurs
  demystify_python.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  // Run the grading algorithm if successful 
  demystify_python.on('close', (code) => {
    if (code === 0) {
      console.log('Demystify process completed successfully');
      readFileAndGradePuzzle();
    } else {
      console.error(`Demystify process exited with code ${code}. An error occurred.`);
    }
  });
  return;
};

// Run DEMYSTIFY python script
call_demystify();

// Reference: Running python script from Node.js: lines 86 to 113
// https://medium.com/swlh/run-python-script-from-node-js-and-send-data-to-browser-15677fcf199f


// Fetch JSON file and Grade Puzzle
// ---------------------------------------------------------

var readFileAndGradePuzzle = function(){
  /*
  Funtion to read in DEMYSTIFY output, extract MUS data, and grade 
  the puzzle.
  */

  // Read in File
  fs.readFile(`../DemystifyOutput/${boardString}.json`, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    // Get array of smallest MUSSize's at each solving step
    const smallestMUSSizes = getSmallestMUSSizes(data);

    // Sort array into descending order 
    smallestMUSSizes.sort(function(a, b){return b-a});

    // Largest MUS Size
    const largestMUSSize = Math.max(...smallestMUSSizes);

    // Sum of MUS Sizes
    const SumOfMUSSizes = getSumOfMUSSizes(smallestMUSSizes);

    // Counting Empty Cells 
    const EmptyCellCount = countEmptyCells(board);

    // Output some instant data to user
    console.log(`Largest MUS size: ${largestMUSSize}. Sum: ${SumOfMUSSizes}. Empty Cells: ${EmptyCellCount}.`);

    // Diffculty Score Formula:

    // Variable weights 
    const X1 = 80;
    const Y1 = 10;
    const Z1 = 10; 

    // The Formula
    const DifficultyScore = X1 * largestMUSSize + Y1  * SumOfMUSSizes + Z1 * EmptyCellCount

    // The grade category
    const grade = getGradeLevel(DifficultyScore);
    console.log(grade);

    // Save the populated board to as .param file in BOARD Storage.
    saveBoardwithDifficultyGrade(largestMUSSize, EmptyCellCount, smallestMUSSizes, SumOfMUSSizes, DifficultyScore, X1, Y1, Z1, grade);
    
    return;
  });
}
// Reference: Sorting MUSes
// https://www.w3schools.com/jsref/jsref_sort.asp


var getSmallestMUSSizes = function(data) {
  /*
  Function to convert the JSON data into an Object, and then
  get an array of all the smallest MUS sizes used by DEMYSTIFY 
  to solve the puzzle. 
  */

  // Convert JSON to object
  const demystifyJSON = data;
  const demystifyObj = JSON.parse(demystifyJSON);

  // Array of all MUS Sizes
  const smallestMUSSizes = demystifyObj.steps.filter(function(step){return step.smallestMUSSize !== undefined}).map(function(step){return step.smallestMUSSize});
  console.log(smallestMUSSizes);

  return smallestMUSSizes;
}

var getSumOfMUSSizes = function(smallestMUSSizes){
  /*
  Function to get the SumOfMUSSizes variable
  */

  // create a variable for the sum and initialize it
  let sum = 0;

  // Iterate over each MUS Size in the array
  for (let i = 0; i < smallestMUSSizes.length; i++ ) {
    sum += smallestMUSSizes[i];
  }
  return sum;
}

var countEmptyCells = function(board){
  /*
  Function to count the number of empty cells in initial board.
  */

  let count = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === 0) {
        count++;
      }
    }
  }
  return count;
}

function printBoardToFile(board) {
  /*
  // Function to display the Board Nicely
  */
  let output = '';
  let count = 0; 
  for (let i = 0; i < board.length; i++) {
      if (i % 3 === 0 && i !== 0) {
          output += "- - - - - - - - - - - -\n";
      }
      let rowString = "";
      for (let j = 0; j < board[0].length; j++) {
        count+= 1; 
        if (j % 3 === 0 && j !== 0) {
          rowString += " |";
        } 
        rowString += " " + board[i][j];
      }
      output += rowString + '\n';
  }
  return output;
}
// Reference: printBoardToFile is based on a conversion of python code to display sudoku board in terminal
// https://www.techwithtim.net/tutorials/python-programming/sudoku-solver-backtracking/part-2

function getGradeLevel(DifficultyScore) {
  /*
  Function give the puzzle a grade based on its difficulty score
  */
  let grade = "";
  if(DifficultyScore <= 500){
    grade = "Easy";
  } else if (501 <= DifficultyScore && DifficultyScore <=869){
    grade = "Medium";
  } else if (870 <= DifficultyScore && DifficultyScore <= 2300){
    grade = "Hard";
  } else if (2301 <= DifficultyScore && DifficultyScore <= 3300){
    grade = "Very Hard";
  } else if(3300 <= DifficultyScore){
    grade = "Evil";
  }
  console.log(grade);
  return grade;
}

function saveBoardwithDifficultyGrade(largestMUSSize, EmptyCellCount, smallestMUSSizes, SumOfMUSSizes, DifficultyScore, X1, Y1, Z1, grade){
  /*
  Function to save output starting puzzle, solution, MUS metrics, and 
  grade formula in Board Storage. 
  */

  // Intial Board
  let output1 = printBoardToFile(board);

  // Solution
  let output2 = printBoardToFile(populatedSudokuBoard);
  const storageContent = ` The Puzzle: 

${output1}  

------------------------------------------------------------------------------------------------------------------
List of Smallest Minimal Unsatisfiable Sets (MUSes) at Each Solving Step in Descending Order: 
${smallestMUSSizes} 
------------------------------------------------------------------------------------------------------------------
Difficulty Metrics: 
Largest 'smallest' MUS Size (${largestMUSSize}), Sum of MUS Sizes (${SumOfMUSSizes}), Empty Cell Count (${EmptyCellCount})
-------------------------------------------------------------------------------------------------------------------
Difficulty Score: ${DifficultyScore} = X1 * largestMUSSize  + Y1 * SumOfMUSSizes + Z1  * EmptyCellCount
Where, X1: ${X1}, Y1: ${Y1}, Z1: ${Z1}
Assigned Grade: ${grade}
-------------------------------------------------------------------------------------------------------------------
Solution: 
${output2} 

`;

  
fs.writeFile(`../BoardStorage/${grade}/${grade}${boardString}.param`, storageContent, err => {
  /*
  Function to save the board to BoardStorage folder. 
  */
  if (err) {
    console.error('Error saving file:', err);
    } else {
    console.log('New board saved successfully!');
    }
  });
}

