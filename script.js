const board = document.querySelector(".board");
const name1 = document.querySelector(".name1");
const name2 = document.querySelector(".name2");

createBoard();

function createPlayer(name, marker) {
  let score = 0;
  return { name, marker, score };
}

const player1 = createPlayer("Akshat", "X");
const player2 = createPlayer("Friend", "O");

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
  let gameStatus = { status: null, winner: null };
  let activePlayer = player1;

  function playRound(index) {
    if (gameStatus.status !== null) {
      return;
    }

    let roundStatus = Gameboard.addMark(index, activePlayer.marker);

    if(!roundStatus) return;

    gameStatus = gameController.checkWinner(activePlayer);

    if(gameStatus.status === "Win") return gameStatus.winner.score++;

    if (gameStatus.status === null) {
      activePlayer = activePlayer === player1 ? player2 : player1;
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
        return { status: "Win", winner: mover }
      }
    }

    if (!gameArr.includes("")) {
      return { status: "Tie", winner: null };
    }

    return { status: null, winner: null};
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getGameStatus() {
    return gameStatus;
  }

  return { playRound, checkWinner, getActivePlayer, getGameStatus };
})();

function createBoard() {
  for (let i = 0; i < 9; i++) {
    const button = document.createElement("button");
    button.classList.add("cell");
    button.dataset.index = i;
    button.textContent = "X";
    button.dataset.mark = "X"
    board.appendChild(button);
  }
}

name1.textContent = `${player1.name}: ${player1.score}`;
name2.textContent = `${player2.name}: ${player2.score}`;
