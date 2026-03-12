let tictactoe = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""]
];

// track the turn
let currentTurn = "x";

//Track number of turns
remainingTurns = 9;

//blank variable for current player
let currentPlayer;
// Track if game is over
let gameOver = false;

// Funstion to check the gameboard for a win or draw
function checkGameboard(tictactoe) {
  let winState = "d";
  //rows
  for (let row = 0; row < 3; row++) {
    if (
      tictactoe[row][0] &&
      tictactoe[row][0] === tictactoe[row][1] &&
      tictactoe[row][1] === tictactoe[row][2]
    ) {
      return tictactoe[row][0];
    }
  }

  //columns
  for (let col = 0; col < 3; col++) {
    if (
      tictactoe[0][col] &&
      tictactoe[0][col] === tictactoe[1][col] &&
      tictactoe[1][col] === tictactoe[2][col]
    ) {
      return tictactoe[0][col];
    }
  }

  //diagonal 
  if (
    tictactoe[0][0] &&
    tictactoe[0][0] === tictactoe[1][1] &&
    tictactoe[1][1] === tictactoe[2][2]
  ) {
    return tictactoe[0][0];
  }

  //diagonal
  if (
    tictactoe[0][2] &&
    tictactoe[0][2] === tictactoe[1][1] &&
    tictactoe[1][1] === tictactoe[2][0]
  ) {
    return tictactoe[0][2];
  }
  return winState;
}

//Function to handle clicks
function clickSquare() {
  // Check if game is over

  // check if space is empty
  if ((this.innerHTML == "") && (!gameOver)) {


    //set Space
    this.innerHTML = currentTurn;

    remainingTurns = remainingTurns - 1;
    console.log("Remaining turns:" + remainingTurns);

    //update array of rows with player value
    if (this.id == "a1") tictactoe[0][0] = currentTurn;
    if (this.id == "a2") tictactoe[0][1] = currentTurn;
    if (this.id == "a3") tictactoe[0][2] = currentTurn;
    if (this.id == "b1") tictactoe[1][0] = currentTurn;
    if (this.id == "b2") tictactoe[1][1] = currentTurn;
    if (this.id == "b3") tictactoe[1][2] = currentTurn;
    if (this.id == "c1") tictactoe[2][0] = currentTurn;
    if (this.id == "c2") tictactoe[2][1] = currentTurn;
    if (this.id == "c3") tictactoe[2][2] = currentTurn;

    //output arrays to console
    console.log(tictactoe);


    let gameOutputMsg = document.querySelector("#gameResult span");

    // call your function checkGameboard() with the 3 rows

    let winState = checkGameboard(tictactoe);


    // test the returned value of the function
    if (winState == "x") {
      gameOutputMsg.innerHTML = "X wins";
      gameOver = true;

    } else if (winState == "o") {
      gameOutputMsg.innerHTML = "O wins";
      gameOver = true;

    } else if ((winState == "d") && (remainingTurns == 0)) {
      gameOutputMsg.innerHTML = "Draw";
      gameOver = true;

    }

    if (gameOver) {
      document.querySelector("#gameResult").style.display = "block";
    }

    //flip between turns
    if (currentTurn == "x") currentTurn = "o";
    else currentTurn = "x";



    currentPlayer.innerHTML = currentTurn.toUpperCase();
  }
}

// Get the button element by its ID
    let refreshBtn = document.getElementById("refreshButton");

    // Add a click event listener to the button
    refreshBtn.addEventListener("click", function() {
        window.location.reload();
    });

//waits for document to load
document.addEventListener("DOMContentLoaded", function () {

  let allSpace = document.querySelectorAll(".box");

  // loops through all the clickables
  for (let eachSpace of allSpace) {
    eachSpace.addEventListener("click", clickSquare);
  }
  currentPlayer = document.querySelector("#currentPlayer span");
  currentPlayer.innerHTML = currentTurn.toUpperCase();
});

