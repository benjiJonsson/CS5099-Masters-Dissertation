
# A General Grading Method for Sudoku Puzzles Based on Minimal Unsatisfiable Sets (MUSes)


## Abstract 

The varied difficulty of Sudoku puzzles offers an exciting domain for measuring the difficulty of logic problems for humans. Current approaches focus on directly modelling how humans solve Sudoku puzzles by summing the perceived difficulty of the solving techniques used when solving them. This paper proposes a more general method for measuring the difficulty of Sudoku puzzles using a solving algorithm based on Minimal Unsatisfiable Sets (MUSes). Based on insight from existing grading methods, the formula thoughtfully accounts for the different aspects of difficulty in solving a Sudoku puzzle by combining the number and size of MUSes. The paper compares the formula grades to puzzle grades from notable Sudoku publishers. The results indicate that MUSes can assess the difficulty level of Sudoku puzzles. Additionally, this paper presents a Backtracking Search algorithm that can generate new Sudoku (and Miracle Sudoku) puzzles to create a library of puzzles for further statistical analysis. 

## Guide for installing required software, and running the algorithms

## Running the Whole Generating, Solving, and Grading Process
1. Install DEMYSTIFY:
Go to https://github.com/stacs-cp/demystify/blob/master/README.md and follow DEMYSTIFY and Conjure install instructions.

2. Clone MastersDissertation into Working Repository:
Have Conjure, DEMYSTIFY, and the MastersDissertation folders in same location to make accessing them easier.

3. Make Modifications to Difficulty_API.js File:
Go to line 92. From here you will need to change the locations of where you want to run the python scripts from (which run the DEMYSTIFY solver). To be safe, you can hard code the exact locations of all the specific files. Modify the file locations listed in lines 92 to 104 to the location where you have the Conjure, DEMYSTIFY, and MastersDissertation files.

4. Set Working Directory to Sudoku folder:
Open a new terminal at the MastersDissertation folder, and then run:
```
cd Sudoku
```
5. Then, run: 
```
node Difficulty_API.js. 
```
Output:
The results will be displayed in the terminal, for that specific puzzle, and you can observe all results in the BoardStorage folders.

## Testing pre-generated puzzles
1. Input Board:
To grade existing puzzles, say from other publishers, you can input the boards manually in the Grade_Testing.js file.

2. Modify Code:
To have DEMYSTIFY solve a specific puzzle and get a grade output, you need to go the Difficulty_API.js and comment out line 26 and uncomment out line 19 to access the pre generated boards. Change the code in line 29 and set the board variable equal to the board you previously filled in i.e., hard_board.
Also comment out line 292 (shows Solution, which you already have) and remove line 309.

## Running the Process for Miracle Sudoku

1. Change Some Code to Account for Different Puzzle Format:
For DEMYSTIFY to solve a Miracle Sudoku puzzle instead of a Sudoku puzzle you need to change the code in line 96 of the Difficulty_API.js file from sudoku.eprime to miracle.eprime.
Comment out line 26 (importing generic Sudoku) and uncomment out the line 23 (importing Miracle Sudoku).

2. In terminal, set working directory to MiracleSudoku folder. Then run: 
```
node Miracle.js
```
