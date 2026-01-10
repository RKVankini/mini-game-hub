const board = document.getElementById("board");
const shuffleBtn = document.getElementById("shuffleBtn");
const message = document.getElementById("message");

let pieces = [];
let draggedPiece = null;

const levels = {
  easy: {
    size: 3,
    image: "../../assets/images/puzzle1.jpg"
  },
  medium: {
    size: 4,
    image: "../../assets/images/puzzle2.png"
  },
  hard: {
    size: 5,
    image: "../../assets/images/onepiece-hard.webp"
  }
};

let currentLevel = levels.easy;

function setLevel(level) {
  currentLevel = levels[level];
  createPuzzle();
}

function createPuzzle() {
  const size = currentLevel.size;
  const boardSize = 300;
  const pieceSize = boardSize / size;

  board.style.width = boardSize + "px";
  board.style.height = boardSize + "px";
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  pieces = [];
  board.innerHTML = "";
  message.textContent = "";

  for (let i = 0; i < size * size; i++) {
    const piece = document.createElement("div");
    piece.className = "piece";
    piece.draggable = true;

    const row = Math.floor(i / size);
    const col = i % size;

    piece.style.width = pieceSize + "px";
    piece.style.height = pieceSize + "px";
    piece.style.backgroundImage = `url(${currentLevel.image})`;
    piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
    piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

    piece.dataset.correct = i;
    pieces.push(piece);
  }

  shufflePieces();
}

function shufflePieces() {
  pieces.sort(() => Math.random() - 0.5);
  render();
}

function render() {
  board.innerHTML = "";
  pieces.forEach(piece => board.appendChild(piece));
}

board.addEventListener("dragstart", e => {
  if (!e.target.classList.contains("piece")) return;
  draggedPiece = e.target;
});

board.addEventListener("dragover", e => e.preventDefault());

board.addEventListener("drop", e => {
  if (!e.target.classList.contains("piece")) return;

  const from = pieces.indexOf(draggedPiece);
  const to = pieces.indexOf(e.target);

  [pieces[from], pieces[to]] = [pieces[to], pieces[from]];
  render();
  checkWin();
});

function checkWin() {
  const solved = pieces.every(
    (piece, index) => piece.dataset.correct == index
  );

  if (solved) {
    message.textContent = "🎉 Puzzle Completed! Amazing!";
    message.style.color = "green";
  }
}

shuffleBtn.addEventListener("click", shufflePieces);

// Default load
createPuzzle();
