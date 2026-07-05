let player1, player2;

function createPlayer(name, marker) {
  let score = 0;
  return { name, marker, score };
}

//IIFEs
//1. gameBoard - handle internal board state.
const gameBoard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function addMark(index, marker) {
    // check if the cell is already marked.
    if (board[index] !== "") return false;

    board[index] = marker;
    return true;
  }

  function resetBoard() {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  }

  function readBoard() {
    let boardCopy = board.slice();
    return boardCopy;
  }

  return { addMark, resetBoard, readBoard };
})();

// 2. gameController - controls the game, perform multiple functions like - start game, play round And check winner.
const gameController = (function () {
  let player1, player2, activePlayer, gameStatus;

  function startGame(p1, p2) {
    player1 = p1;
    player2 = p2;
    activePlayer = p1;
    gameStatus = { status: null, winner: null };
  }

  function playRound(index) {
    if (gameStatus.status !== null) return;

    // update internal state.
    let roundStatus = gameBoard.addMark(index, activePlayer.marker);

    // returns if cell is already marked
    if (!roundStatus) return;

    gameStatus = gameController.checkWinner(activePlayer);

    if (gameStatus.status === "Win") return gameStatus.winner.score++;

    // Only pass the turn if the game is still ongoing — no point flipping turns after a win/tie
    if (gameStatus.status === null) {
      activePlayer = activePlayer === player1 ? player2 : player1;
    }
  }

  function checkWinner(mover) {
    let gameArr = gameBoard.readBoard();

    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        gameArr[a] === gameArr[b] &&
        gameArr[b] === gameArr[c] &&
        gameArr[a] !== ""
      ) {
        return { status: "Win", winner: mover };
      }
    }

    if (!gameArr.includes("")) {
      return { status: "Tie", winner: null };
    }

    return { status: null, winner: null };
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getGameStatus() {
    return gameStatus;
  }

  return { startGame, playRound, checkWinner, getActivePlayer, getGameStatus };
})();

// 3. displayController - changes the DOM state/Update the UI
const displayController = (function () {
  const nameOne = document.querySelector(".name1");
  const nameTwo = document.querySelector(".name2");
  const dialog = document.querySelector("dialog");
  const resultText = document.querySelector(".result-text");

  function createBoard() {
    displayBoard.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const button = document.createElement("button");
      button.classList.add("cell");
      button.dataset.index = i;
      button.textContent = "";
      button.dataset.mark = "";
      displayBoard.appendChild(button);
    }
  }

  function showName(player1, player2) {
    nameOne.textContent = `${player1.name}: ${player1.score}`;
    nameTwo.textContent = `${player2.name}: ${player2.score}`;
  }

  function updateActivePlayerClass() {
    const active = gameController.getActivePlayer();
    nameOne.classList.toggle("active", active.marker === "X");
    nameTwo.classList.toggle("active", active.marker === "O");
  }

  function renderBoard() {
    const updatedBoard = gameBoard.readBoard();
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const index = cell.dataset.index;
      cell.textContent = updatedBoard[index];
      cell.dataset.mark = updatedBoard[index];
    });
  }

  function showResult(gameStatus) {
    if (gameStatus.status === null) return;

    if (gameStatus.status === "Win")
      resultText.textContent = `${gameStatus.winner.name} Won!`;
    if (gameStatus.status === "Tie") resultText.textContent = "It's a Tie!";

    dialog.showModal();
  }

  function updateScore(winner) {
    if (winner === null) return;

    if (winner.marker === "X") {
      nameOne.textContent = `${winner.name}: ${winner.score}`;
    } else {
      nameTwo.textContent = `${winner.name}: ${winner.score}`;
    }
  }

  return {
    createBoard,
    showName,
    updateActivePlayerClass,
    renderBoard,
    showResult,
    updateScore,
  };
})();

// Event Listeners

const startBtn = document.querySelector(".start-btn");
const playAgainBtn = document.querySelector(".play-again");
const resetGameBtn = document.querySelector(".reset-game");
let displayBoard = document.querySelector(".board");

startBtn.addEventListener("click", () => {
  const firstPage = document.querySelector(".first-page");
  const main = document.querySelector(".main");
  const form = document.querySelector("form");
  const formData = new FormData(form);
  let playerOneName = formData.get("player1-name");
  let playerTwoName = formData.get("player2-name");

  if (playerOneName === "") playerOneName = "Player One";
  if (playerTwoName === "") playerTwoName = "Player Two";

  // Create players
  player1 = createPlayer(playerOneName, "X");
  player2 = createPlayer(playerTwoName, "O");

  gameController.startGame(player1, player2);
  displayController.updateActivePlayerClass();
  displayController.showName(player1, player2);
  displayController.createBoard();
  firstPage.classList.toggle("hidden");
  main.classList.toggle("hidden");
});

displayBoard.addEventListener("click", (event) => {
  const cellIndex = event.target.dataset.index;

  gameController.playRound(Number(cellIndex));

  const gameStatus = gameController.getGameStatus();

  displayController.updateScore(gameStatus.winner);
  displayController.showResult(gameStatus);
  displayController.updateActivePlayerClass();
  displayController.renderBoard();
});

playAgainBtn.addEventListener("click", () => {
  const dialog = document.querySelector("dialog");

  gameController.startGame(player1, player2);
  displayController.updateActivePlayerClass();
  gameBoard.resetBoard();
  displayController.renderBoard();
  dialog.close();
});

resetGameBtn.addEventListener("click", () => {
  const firstPage = document.querySelector(".first-page");
  const main = document.querySelector(".main");
  const dialog = document.querySelector("dialog");
  const form = document.querySelector("form");

  gameBoard.resetBoard();
  form.reset();
  firstPage.classList.toggle("hidden");
  main.classList.toggle("hidden");
  dialog.close();
});
