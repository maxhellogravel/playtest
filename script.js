// ===========================================
// CLASSIC TIC TAC TOE
// ===========================================

const cells = Array.from(document.querySelectorAll(".cell"));
const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const gravelModeBtn = document.getElementById("gravel-mode");

let gravelMode = false;

function getSymbol(player) {
  if (gravelMode) {
    return player === "O" ? "🪨" : "🚛";
  }
  return player;
}

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
    cell.textContent = mark ? getSymbol(mark) : "";
    cell.classList.toggle("o", mark === "O");
    cell.classList.toggle("x", mark === "X");
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    const markLabel = mark ? ` (${getSymbol(mark)})` : "";
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
    statusEl.textContent = `Your turn: place a ${getSymbol("O")}`;
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
  statusEl.textContent = `Your turn: place a ${getSymbol("O")}`;
  renderBoard();
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleUserMove(index));
});

resetBtn.addEventListener("click", resetGame);

gravelModeBtn.addEventListener("click", () => {
  gravelMode = !gravelMode;
  gravelModeBtn.textContent = gravelMode ? "Normal Mode" : "Hello Gravel Mode";
  renderBoard();
  if (!gameOver) {
    statusEl.textContent = `Your turn: place a ${getSymbol("O")}`;
  }
});

renderBoard();

// ===========================================
// SICKO MODE (Ultimate Tic Tac Toe)
// ===========================================

const classicGameEl = document.getElementById("classic-game");
const sickoGameEl = document.getElementById("sicko-game");
const sickoModeBtn = document.getElementById("sicko-mode-btn");
const classicModeBtn = document.getElementById("classic-mode-btn");
const ultimateBoardEl = document.getElementById("ultimate-board");
const sickoStatusEl = document.getElementById("sicko-status");
const sickoResetBtn = document.getElementById("sicko-reset");

// Ultimate Tic Tac Toe state
let sickoBoards = []; // Array of 9 boards, each is an array of 9 cells
let sickoBoardWinners = []; // Array of 9 values: null, "O", "X", or "draw"
let sickoCurrentPlayer = "O";
let sickoActiveBoard = null; // Which board the current player must play on (null = any)
let sickoGameOver = false;

// Initialize the Ultimate board
function initSickoMode() {
  // Reset state
  sickoBoards = Array(9).fill(null).map(() => Array(9).fill(null));
  sickoBoardWinners = Array(9).fill(null);
  sickoCurrentPlayer = "O";
  sickoActiveBoard = null;
  sickoGameOver = false;

  // Clear and rebuild the board
  ultimateBoardEl.innerHTML = "";

  for (let boardIndex = 0; boardIndex < 9; boardIndex++) {
    const miniBoard = document.createElement("div");
    miniBoard.className = "mini-board";
    miniBoard.dataset.boardIndex = boardIndex;

    for (let cellIndex = 0; cellIndex < 9; cellIndex++) {
      const cell = document.createElement("button");
      cell.className = "mini-cell";
      cell.type = "button";
      cell.dataset.boardIndex = boardIndex;
      cell.dataset.cellIndex = cellIndex;
      cell.addEventListener("click", () => handleSickoMove(boardIndex, cellIndex));
      miniBoard.appendChild(cell);
    }

    ultimateBoardEl.appendChild(miniBoard);
  }

  updateSickoStatus();
  renderSickoBoard();
}

// Render the entire Ultimate board
function renderSickoBoard() {
  const miniBoards = ultimateBoardEl.querySelectorAll(".mini-board");

  miniBoards.forEach((miniBoardEl, boardIndex) => {
    const boardWinner = sickoBoardWinners[boardIndex];

    // Update board classes
    miniBoardEl.classList.remove("active", "won-o", "won-x", "draw");

    if (boardWinner === "O") {
      miniBoardEl.classList.add("won-o");
    } else if (boardWinner === "X") {
      miniBoardEl.classList.add("won-x");
    } else if (boardWinner === "draw") {
      miniBoardEl.classList.add("draw");
    }

    // Highlight active board(s)
    if (!sickoGameOver && !boardWinner) {
      if (sickoActiveBoard === null || sickoActiveBoard === boardIndex) {
        miniBoardEl.classList.add("active");
      }
    }

    // Remove existing winner overlay
    const existingWinner = miniBoardEl.querySelector(".board-winner");
    if (existingWinner) {
      existingWinner.remove();
    }

    // Add winner overlay if board is won
    if (boardWinner && boardWinner !== "draw") {
      const winnerEl = document.createElement("span");
      winnerEl.className = `board-winner ${boardWinner.toLowerCase()}`;
      winnerEl.textContent = boardWinner;
      miniBoardEl.appendChild(winnerEl);
    }

    // Update cells
    const cells = miniBoardEl.querySelectorAll(".mini-cell");
    cells.forEach((cell, cellIndex) => {
      const mark = sickoBoards[boardIndex][cellIndex];
      cell.textContent = mark || "";
      cell.classList.remove("o", "x");
      if (mark) {
        cell.classList.add(mark.toLowerCase());
      }

      // Disable cells that can't be played
      const canPlay = !sickoGameOver &&
        !boardWinner &&
        !mark &&
        (sickoActiveBoard === null || sickoActiveBoard === boardIndex);
      cell.disabled = !canPlay;
    });
  });
}

// Handle a move in Sicko Mode
function handleSickoMove(boardIndex, cellIndex) {
  // Validate the move
  if (sickoGameOver) return;
  if (sickoBoardWinners[boardIndex]) return; // Board already won
  if (sickoBoards[boardIndex][cellIndex]) return; // Cell already taken
  if (sickoActiveBoard !== null && sickoActiveBoard !== boardIndex) return; // Wrong board

  // Make the move
  sickoBoards[boardIndex][cellIndex] = sickoCurrentPlayer;

  // Check if this move won the mini-board
  const boardResult = checkWinner(sickoBoards[boardIndex]);
  if (boardResult) {
    sickoBoardWinners[boardIndex] = boardResult;
  }

  // Check if the game is over (someone won the meta-game)
  const metaResult = checkWinner(sickoBoardWinners.map(w => w === "draw" ? null : w));
  if (metaResult) {
    sickoGameOver = true;
    renderSickoBoard();
    updateSickoStatus(metaResult);
    return;
  }

  // Check for overall draw (all boards decided but no winner)
  if (sickoBoardWinners.every(w => w !== null)) {
    sickoGameOver = true;
    renderSickoBoard();
    updateSickoStatus("draw");
    return;
  }

  // Determine the next active board
  // The cell index determines which board the opponent must play on
  const nextBoard = cellIndex;

  // If that board is already won/drawn, opponent can play anywhere
  if (sickoBoardWinners[nextBoard]) {
    sickoActiveBoard = null;
  } else {
    sickoActiveBoard = nextBoard;
  }

  // Switch players
  sickoCurrentPlayer = sickoCurrentPlayer === "O" ? "X" : "O";

  renderSickoBoard();
  updateSickoStatus();
}

// Update the status message
function updateSickoStatus(result) {
  if (result === "O") {
    sickoStatusEl.textContent = "Player O wins!";
  } else if (result === "X") {
    sickoStatusEl.textContent = "Player X wins!";
  } else if (result === "draw") {
    sickoStatusEl.textContent = "It's a draw!";
  } else {
    let msg = `Player ${sickoCurrentPlayer}'s turn`;
    if (sickoActiveBoard === null) {
      msg += " - pick any square";
    } else {
      const row = Math.floor(sickoActiveBoard / 3) + 1;
      const col = (sickoActiveBoard % 3) + 1;
      msg += ` - must play in board (${row},${col})`;
    }
    sickoStatusEl.textContent = msg;
  }
}

// Mode switching
sickoModeBtn.addEventListener("click", () => {
  classicGameEl.classList.add("hidden");
  sickoGameEl.classList.remove("hidden");
  initSickoMode();
});

classicModeBtn.addEventListener("click", () => {
  sickoGameEl.classList.add("hidden");
  classicGameEl.classList.remove("hidden");
  resetGame();
});

sickoResetBtn.addEventListener("click", initSickoMode);
