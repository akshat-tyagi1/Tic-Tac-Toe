function createPlayer(name, marker) {
  let score = 0;
  return { name, marker, score };
}

const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function addMark(index, marker) {
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

const gameController = (function () {
  let player1, player2, activePlayer, gameStatus;

  function startGame(p1, p2) {
    player1 = p1;
    player2 = p2;
    activePlayer = p1;
    gameStatus = { status: null, winner: null };
  }

  function playRound(index) {
    if (gameStatus.status !== null) {
      return;
    }

    let roundStatus = Gameboard.addMark(index, activePlayer.marker);

    if (!roundStatus) return;

    gameStatus = gameController.checkWinner(activePlayer);

    if (gameStatus.status === "Win") return gameStatus.winner.score++;

    if (gameStatus.status === null) {
      activePlayer = activePlayer === player1 ? player2 : player1;
      displayController.updateActivePlayer();
    }
  }

  function checkWinner(mover) {
    let gameArr = Gameboard.readBoard();

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

const displayController = (function () {
  const nameOne = document.querySelector(".name1");
  const nameTwo = document.querySelector(".name2");
  nameOne.classList.add("active");

  function createBoard() {
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

  function updateActivePlayer() {
    nameOne.classList.toggle("active");
    nameTwo.classList.toggle("active");
  }

  function renderBoard() {
    const updatedBoard = Gameboard.readBoard();
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      const index = cell.dataset.index;
      cell.textContent = updatedBoard[index];
      cell.dataset.mark = updatedBoard[index];
    });
  }

  return { createBoard, showName, updateActivePlayer, renderBoard };
})();

const displayBoard = document.querySelector(".board");
const form = document.querySelector("form");
const startBtn = document.querySelector(".start-btn");
const firstPage = document.querySelector(".first-page");
const main = document.querySelector(".main");

startBtn.addEventListener("click", () => {
  const formData = new FormData(form);
  let playerOneName = formData.get("player1-name");
  let playerTwoName = formData.get("player2-name");

  if (playerOneName === "") playerOneName = "Player One";
  if (playerTwoName === "") playerTwoName = "Player Two";

  const player1 = createPlayer(playerOneName, "X");
  const player2 = createPlayer(playerTwoName, "O");

  gameController.startGame(player1, player2);
  displayController.showName(player1, player2);
  displayController.createBoard();
  firstPage.classList.toggle("hidden");
  main.classList.toggle("hidden");
});

displayBoard.addEventListener("click", (event) => {
  const cellIndex = event.target.dataset.index;
  gameController.playRound(Number(cellIndex));
  displayController.renderBoard();
});
