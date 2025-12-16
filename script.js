const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const COMPUTER_DELAY_MS = 250;

let board = Array(9).fill(null);
let gameOver = false;

// Renders the board state onto the buttons and updates accessible labels.
function renderBoard() {
  cells.forEach((cell, index) => {
    const mark = board[index];
    cell.textContent = mark ? mark : "";
    cell.classList.toggle("o", mark === "O");
    cell.classList.toggle("x", mark === "X");
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const markLabel = mark ? ` (${mark})` : "";
    cell.setAttribute("aria-label", `Row ${row} Column ${col}${markLabel}`);
  });
}

// Returns "O", "X", "draw", or null depending on board state.
function checkWinner(currentBoard) {
  for (const [a, b, c] of winningCombos) {
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      return currentBoard[a];
    }
  }
  if (currentBoard.every((cell) => cell)) {
    return "draw";
  }
  return null;
}

// Handles the human move when a cell is clicked.
function handleUserMove(index) {
  if (gameOver || board[index]) {
    return;
  }
  board[index] = "O";
  renderBoard();

  const result = checkWinner(board);
  if (result) {
    endGame(result);
    return;
  }

  statusEl.textContent = "Computer thinking...";
  setTimeout(() => {
    if (!gameOver) {
      computerMove();
    }
  }, COMPUTER_DELAY_MS);
}

// Determines and performs the computer's move using simple priority rules.
function computerMove() {
  if (gameOver) {
    return;
  }

  const move =
    findWinningMove("X") ??
    findWinningMove("O") ??
    takeCenter() ??
    takeRandomCorner() ??
    takeAnyOpenSpot();

  if (move === null || move === undefined) {
    return;
  }

  board[move] = "X";
  renderBoard();

  const result = checkWinner(board);
  if (result) {
    endGame(result);
  } else {
    statusEl.textContent = "Your turn: place an O";
  }
}

// Ends the game and displays the appropriate message.
function endGame(result) {
  gameOver = true;
  if (result === "O") {
    statusEl.textContent = "congrats";
  } else if (result === "X") {
    statusEl.textContent = "Computer wins";
  } else {
    statusEl.textContent = "Draw";
  }
}

// Finds a winning move for the specified player, if one exists.
function findWinningMove(player) {
  for (const [a, b, c] of winningCombos) {
    const line = [board[a], board[b], board[c]];
    const marks = line.filter((cell) => cell === player).length;
    const empties = line.filter((cell) => !cell).length;
    if (marks === 2 && empties === 1) {
      if (!board[a]) return a;
      if (!board[b]) return b;
      if (!board[c]) return c;
    }
  }
  return null;
}

// Takes the center cell if free.
function takeCenter() {
  return board[4] ? null : 4;
}

// Selects a random available corner.
function takeRandomCorner() {
  const corners = [0, 2, 6, 8].filter((index) => !board[index]);
  if (corners.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * corners.length);
  return corners[randomIndex];
}

// Picks any remaining open spot.
function takeAnyOpenSpot() {
  const open = board.map((cell, index) => (cell ? null : index)).filter((value) => value !== null);
  return open.length ? open[0] : null;
}

// Resets board state and UI for a fresh game.
function resetGame() {
  board = Array(9).fill(null);
  gameOver = false;
  statusEl.textContent = "Your turn: place an O";
  renderBoard();
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleUserMove(index));
});

resetBtn.addEventListener("click", resetGame);

renderBoard();
