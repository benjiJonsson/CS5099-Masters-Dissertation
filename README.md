
# How to Run: 

Step 1: Install DEMYSTIFY
Go to https://github.com/stacs-cp/demystify/blob/master/README.md and follow DEMYSTIFY and Conjure install instructions.

Step 2: Clone MastersThesis Folder into Repository
Have Conjure, DEMYSTIFY, and the MastersThesis folders in same location to make accessing them easier.

Step 3: Make Modifications to Difficulty_API.js File
Go to line 68. From here you will need to change the locations of where you want to run the python scripts from (which run the DEMYSTIFY solver). To be safe, you can hard code the exact locations of all the specific files. Modify the lines highlighted in blue to the location where you have the Conjure, DEMYSTIFY, and MastersThesis files.

Step 4: Set Working Directory to Sudoku folder.
Open a new terminal at the MastersThesis folder, and then run:

Step 5:  Then, run: 
```
node Difficulty_API.js. 
```
### Tesrting pre-generated puzzles

Step 1: Input Board
If you want to run existing puzzles, say from other publishers, through the grading formula you can input the boards manually in the Grade_Testing.js file.

Step 2: Modify Code
To have DEMYSTIFY solve a specific puzzle and get a grade output, you need to go the Difficulty_API.js and comment out line 23 and uncomment out line 17 to access the pre generated boards. Change the code in line 25 and set the board variable equal to the board you previously filled in.
Also comment out line 237 and remove line 254.

### Running the Process for Miracle Sudoku
Step 1: Change Some Code to Account for Different Puzzle Format
For DEMYSTIFY to solve a Miracle Sudoku puzzle instead of a Sudoku puzzle you need to change the code in line 73 of the Difficulty_API.js file from sudoku.eprime to miracle.eprime.
And uncomment out the line 20.

In terminal, set working directory to MiracleSudoku folder. Then run: 

```
node Miracle.js
```
