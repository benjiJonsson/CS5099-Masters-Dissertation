/* 
// Simple Backtracking Miracle Sudoku Generator 
// ---------------------------------------------------------

Reference: Sudoku Creation and Grading. 
https://www.sudokuwiki.org/Sudoku_Creation_and_Grading.pdf
    
The first step is to generate a Miracle Sudoku board and 
populate it with numbers according to the laws of Sudoku: 
A filled in grid of 81 numbers (9x9) such that each number 
1 to 9 occupies each row, column and box just once.

BUT now, also three new Miracle rules: 
1. Cell's seprated by a Kings move cannot have same value
2. Cell's seprated by a Knights move cannot have same value
3. No two orthogonally adjacent cells may contain consecutive 
digits.

The secound step is to solve the puzzle backwards to ensure
only one soltuion exsists. 
*/


// Generate Fully Populated Sudoku Board
// ---------------------------------------------------------

function generateSudoku() {
    /* Initializes the generating process
    */

    // Create empty board 
    const board = createEmptyBoard();

    // Initialize Backtracking Search
    backtrackSearch(board);
    return board;
}

// Test if function works by setting board equal to original Miracle Sudoku 
/*  const board = [
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,2,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ]
    const board = createEmptyBoard();
*/

function createEmptyBoard(){
    /* Create 2D Array: 9x9 Arrays with values of 0
    */

    const board = [];
    for(let row = 0; row < 9; row++){
        board[row] = [];
        for(let col = 0; col < 9; col++){
            board[row][col] = 0;
        }
    }
    return board;
}

function backtrackSearch(board){
    /* Simple backtracking search algorithm. The function repeats 
    the same logic recursively and tries to fill in the empty cells 
    until either a valid solution is found or a contradiction is 
    encountered. If a contradiction is encountered, the function 
    backtracks and removes the previous number choice to try another.

    Finds next '0' cell -> tries to place valid number in cell. If
    successful -> move to next cell. If contradiction -> undo 
    previous choice and try another.
    */

    // Return `true` when valid solution is found: no empty cells
    const emptyCell = findNextEmptyCell(board);
    if (!emptyCell) {
        return true;
    }

    // Sets the row and column equal to posiiton of empty cell
    const [row, col] = emptyCell;

    // Shuffled array -> each tested number is chosen at random. 
    const shuffledNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    // Loops through each number in 'random order'
    for (let num of shuffledNumbers) {

        // If valid num, assigns it to to empty cell coordinates
        if (isValidMiraclePlacement(board, row, col, num)){
            board[row][col] = num;

            // The fucntion now recursively calls itself with the  
            // updated board to fill in next empty cell.
            if (backtrackSearch(board)) {
                return true;
            }
            // If false, current number has led to invalid solution. 
            // Undo choice, and tries next number in array. 
            board[row][col] = 0;
        }
    }
    // No solution found
    return false; 
}

function findNextEmptyCell(board){
    /* Iterates through board to find next empty cell. When found
    returns cells coordinates.
    */
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(board[row][col] === 0){
                return [row, col];
            }
        }
    }
    return null;
}

function shuffleArray(array) {
    /* Get a randomly ordered array, using Fisher-Yates algorithm 
    */
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValidMiraclePlacement(board, row, col, num){
    /* Function that checks if current number is valid according
    Sudoku rules i.e, every row, column, 3x3 box must containt all
    different numbers from 1-9.
    */

    // Check if the number is present in row or column
    for(let i = 0; i < 9; i++){
        if(board[row][i] === num || board[i][col] === num){
            //Want to remove that number from 
            //console.log(1);
            return false;
        }
    }

    // Check if the number is present in 3x3 box
    const grid_row = Math.floor(row/3) * 3;
    const grid_col = Math.floor(col/3) * 3;

    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){ 
            if(board[grid_row + i][grid_col + j] === num){
                return false;
            }
        }
    }

    // Miracle Rules
    // "Chess Sudoku" Constraints
    // 1. Cell's seprated by a Kings move cannot containt same value
    if(
        (row - 1 >= 0 && col - 1 >= 0 && board[row -1][col -1] === num ) ||
        (row - 1 >= 0 && board[row -1][col] === num) || 
        (row - 1 >= 0 && col +1 <= 8 && board[row -1][col +1] === num) ||
        (col - 1 >= 0 && board[row][col -1] === num) ||
        (col + 1 <= 8 && board[row][col +1] === num) ||
        (row + 1 <= 8 && col + 1 <= 8 && board[row +1][col -1] === num ) ||
        (row + 1 <= 8 && board[row +1][col] === num) ||
        (row + 1 <= 8 && col + 1 <=8 && board[row +1][col +1] === num )){
        //console.log(3);
        return false; 
      }
    
        // 2. Cell's seprated by a Knights move cannot containt same value
        if (
          (row -2 >= 0 && col -1 >= 0 && board[row -2][col -1] === num) || 
          (row -2 >= 0 && col +1 <= 8 && board[row -2][col +1] === num) || 
          (row -1 >= 0 && col -2 >= 0 && board[row -1][col -2] === num) || 
          (row -1 >= 0 && col +2 <= 8 && board[row -1][col +2] === num) || 
          (row + 1 <= 8 && col - 2 >= 0 && board[row +1][col -2] === num) || 
          (row +1 <= 8 && col +2 <= 8 && board[row +1][col +2] === num) || 
          (row +2 <= 8 && col -1 >= 0 && board[row +2][col -1] === num) || 
          (row +2 <= 8 && col +1 <= 8 && board[row +2][col +1] === num) ){
            //console.log(4);
          return false;
        }
        
        // One additional constraint 
        // No two orthogonally adjacent cells may contain consecutive digits.
        if(num === 1){
            if (
                (row -1 >= 0 && (board[row -1][col] === num +1)) ||
                (col -1 >= 0 && (board[row][col -1] === num +1)) ||
                (col +1 <= 8 && (board[row][col +1] === num +1)) ||
                (row +1 <= 8 && (board[row +1][col] === num +1)) ){
                return false;
            }
        } else if(num != 1){
            if (
                (row -1 >= 0 && (board[row -1][col] === num +1 || board[row -1][col] === num -1)) ||
                (col -1 >= 0 && (board[row][col -1] === num +1 || board[row][col -1] === num -1)) ||
                (col +1 <= 8 && (board[row][col +1] === num +1 || board[row][col +1] === num -1)) ||
                (row +1 <= 8 && (board[row +1][col] === num +1 || board[row +1][col] === num -1)) ){
                return false;
            }
        }        
    return true; 
}

function generateStartingSudoku(board) {
    /* Function to get starting board i.e. board the players will play. 
    Remove two numbers at each step and check that only one valid solution 
    exists. 
    */

    //Gets positon of every cell on the board. 
    const cells = getAllCellPositions();
    selectCellsToBeRemoved(board, cells);
    return board;
}

function getAllCellPositions(){
    /* Function to get position of all cells on the board.
    */

    // First get every cell position on Sudoku Board
    const cells = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
            cells.push([row,col]);
        }
    }

    //Randomising cell selection
    shuffleArray(cells);
    return cells;
}


function selectCellsToBeRemoved(board, cells){
    /* Function to select the number of substractions to make
    based on number of filled cells 
    */
    for(let [row, col] of cells){
        //Count number of filled cells to determine how many to remove at each step. 
        const clueCount = countFilledCells(board);

        if (board[row][col] !== 0){
            if (clueCount > 30){
                removeTwoNumbersAndValidateSolution(row, col, board);
            } else if (clueCount <= 30){
                removeOneNumberAndValidateSolution(row, col, board)
            }
        }
    }
}

function countFilledCells(board){
    /* Iterates through board to find next empty cell. When an empty 
    cell is found, it increases the count variable by 1.
    */
    let clueCount = 0;
    for(let row = 0; row < 9; row++){
        for(let col = 0; col < 9; col++){
            if(board[row][col] !== 0){
                clueCount++;
            }
        }
    }
    return clueCount;
}

function removeTwoNumbersAndValidateSolution(row, col, board){
    /* Function to remove two diagonally opposite numbers at a 
    time and test for a unique solution
    */

    // Set diagonally opposite cell postion 
    const diagonalRow = 8 - row
    const diagonalCol = 8 - col
        
    // Store the value incase we need to backtrack and reset it 
    const cellValue = board[row][col];
    const diagonalCellValue = board[diagonalRow][diagonalCol];
        
    // Set chosen cell and diagonally opposite cell equal to zero
    board[row][col] = 0;
    board[diagonalRow][diagonalCol] = 0;
        
    // Check how many solutions were found
    const solutionNumber = uniqueSolutionCheck(board);
        
    // If more than one solution is found reset the cell numbers 
    if (solutionNumber != 1){
        board[row][col] = cellValue;
        board[diagonalRow][diagonalCol] = diagonalCellValue;
    }
    return board;
}

function removeOneNumberAndValidateSolution(row, col, board){
    /* Function to remove one number at a time and test for 
    a unique solution
    */

    //Store the value incase we need to backtrack and reset it 
    const cellValue = board[row][col];

    //Set chosen cell equal to zero
    board[row][col] = 0;

    //Check how many solutions were found
    const solutionNumber = uniqueSolutionCheck(board);

    // If more than one solution is found reset the cell number
    // This will also ensure a minimum of 17 cells 
    if (solutionNumber != 1){
        board[row][col] = cellValue;
    }
    return board;
}

function uniqueSolutionCheck(board){
    /* Function to store number of different 
    solutions w/ cloned board. 
    */
    const boardCopy = JSON.parse(JSON.stringify(board));
    const solutionNumber = countSolutions(boardCopy);
    return solutionNumber;
}

function countSolutions(board){
    /* Function to see if only one solution occures every time a number is 
    removed. Logic: after each number is removed try fill in the board same way 
    as `search` function and count how many solutions are found. 
    */

    const emptyCell = findNextEmptyCell(board);
    if (!emptyCell) {
      return 1; // Found a solution
    }

    const [row, col] = emptyCell
    let count = 0; 
  
    const shuffledNumbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  
    for (let num of shuffledNumbers) {
      if (isValidMiraclePlacement(board, row, col, num)) {
        board[row][col] = num;
  
        // Recursively call itself and everytime there are no more empty cells
        // (solution is found), it adds that value to the count variable. 
        count += countSolutions(board);
        //console.log(count);
  
        if (count > 1) {
          return count; // More than one solution found, no need to continue searching
        }
  
        // If count = 1, only one soltuon is found, the funciton undoes previous choice
        // and tries to find another solution
        board[row][col] = 0;
      }
    }
    return count;
}

// Fill Sudoku Board
const populatedSudokuBoard = generateSudoku();
const populatedSudokuBoardCopy = JSON.parse(JSON.stringify(populatedSudokuBoard));
// Double Check that the board is valid
// Get Starting board 
const startingSudokuBoard = generateStartingSudoku(populatedSudokuBoardCopy);

// Function to display the Board Nicely in the Console
console.log("Starting Sudoku:");
console.log(startingSudokuBoard.map(function(row) { return `    [${row.join(',')}]` }).join('\n'));
console.log("\nSolved Sudoku:");
console.log(populatedSudokuBoard.map(function(row) { return `    [${row.join(',')}]` }).join('\n'));

// Reference: Joinning Arrays
// https://www.w3schools.com/jsref/jsref_join.asp
// Reference: Using map 
// https://www.w3schools.com/jsref/jsref_map.asp
// Refernce: joining arrays in line 392 and 394
// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-257.php

// Export starting board to be used in Difficulty_API to use 
// DEMYSTIFY to determine difficutly rating. 
exports.startingSudokuBoard = startingSudokuBoard;
exports.populatedSudokuBoard = populatedSudokuBoard; 
