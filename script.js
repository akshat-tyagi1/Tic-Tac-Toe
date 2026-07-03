function createPlayer(name, marker) {
  return { name, marker };
}

const player1 = createPlayer("Akshat", "X");
const player2 = createPlayer("Friend", "O");

const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function addMark(index, marker) {
    if (board[index] !== "") return;
    board[index] = marker;
    return true;
  }

  function resetBoard() {
    for (let i = 0; i < 9; i++) {
      board[i] = "";
    }
  }

  function printBoard() {
    console.log(board);
  }

  function readBoard() {
    let boardCopy = board.slice();
    return boardCopy;
  }

  return { addMark, resetBoard, readBoard, printBoard };
})();

const gameController = (function () {
  let gameStatus = "";
  let activePlayer = player1;

  function playRound(index) {
    if (gameStatus !== "") {
      return;
    }
    let roundStatus = Gameboard.addMark(index, activePlayer.marker);
    if (roundStatus) {
      activePlayer = activePlayer === player1 ? player2 : player1;
    }
    gameStatus = gameController.checkWinner();
    // console.log(gameStatus);
    console.log(Gameboard.readBoard());
  }

  function checkWinner() {
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
        return gameArr[a] === player1.marker
          ? `${player1.name} Won`
          : `${player2.name} Won`;
      }
    }

    if (!gameArr.includes("")) {
      return "Tie";
    }

    return "";
  }

  function getActivePlayer() {
    return activePlayer;
  }

  function getGameStatus() {
    return gameStatus
  }

  return { playRound, checkWinner, getActivePlayer, getGameStatus };
})();
