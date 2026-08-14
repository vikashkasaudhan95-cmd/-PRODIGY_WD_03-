const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const pvpBtn = document.getElementById('pvpMode');
const aiBtn = document.getElementById('aiMode');

let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let isVsAI = false;

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');

  if (boardState[index] !== '' || !isGameActive) return;

  makeMove(index, currentPlayer);

  if (isGameActive && isVsAI && currentPlayer === 'O') {
    setTimeout(makeAIMove, 400);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add(player.toLowerCase());

  checkResult();
}

function makeAIMove() {
  if (!isGameActive) return;

  // Find empty cells
  const emptyIndices = boardState
    .map((val, idx) => (val === '' ? idx : null))
    .filter(val => val !== null);

  if (emptyIndices.length === 0) return;

  // Simple AI: Select a random available cell
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');
}

function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
    isGameActive = false;
    return;
  }

  if (!boardState.includes('')) {
    statusText.textContent = `Game Draw! 🤝`;
    isGameActive = false;
    return;
  }

  // Switch Player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = isVsAI && currentPlayer === 'O' 
    ? "AI is thinking..." 
    : `Player ${currentPlayer}'s Turn`;
}

function resetGame() {
  boardState = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isGameActive = true;
  statusText.textContent = "Player X's Turn";

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o');
  });
}

// Mode Selection Event Listeners
pvpBtn.addEventListener('click', () => {
  isVsAI = false;
  pvpBtn.classList.add('active');
  aiBtn.classList.remove('active');
  resetGame();
});

aiBtn.addEventListener('click', () => {
  isVsAI = true;
  aiBtn.classList.add('active');
  pvpBtn.classList.remove('active');
  resetGame();
});

// Cell & Reset Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);