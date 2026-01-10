const board = document.getElementById("board");
const shuffleBtn = document.getElementById("shuffleBtn");
const message = document.getElementById("message");

let pieces = [];
let draggedIndex = null;

function createPuzzle() {
  board.innerHTML = "";
  pieces = [];

  for (let i = 0; i < 9; i++) {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.draggable = true;

    const x = (i % 3) * -100;
    const y = Math.floor(i / 3) * -100;
    piece.style.backgroundPosition = `${x}px ${y}px`;
    piece.dataset.correct = i;

    pieces.push(piece);
  }

  shufflePieces();
}

function shufflePieces() {
  message.textContent = "";
  pieces.sort(() => Math.random() - 0.5);
  render();
}

function render() {
  board.innerHTML = "";
  pieces.forEach((piece, index) => {
    piece.dataset.current = index;
    board.appendChild(piece);
  });
}

board.addEventListener("dragstart", (e) => {
  draggedIndex = e.target.dataset.current;
});

board.addEventListener("dragover", (e) => e.preventDefault());

board.addEventListener("drop", (e) => {
  const targetIndex = e.target.dataset.current;
  if (draggedIndex === null || targetIndex === undefined) return;

  [pieces[draggedIndex], pieces[targetIndex]] =
    [pieces[targetIndex], pieces[draggedIndex]];

  render();
  checkWin();
});

function checkWin() {
  const solved = pieces.every(
    (piece, index) => piece.dataset.correct == index
  );

  if (solved) {
    message.textContent = "🎉 Puzzle Completed! Great job!";
    message.style.color = "green";
  }
}

shuffleBtn.addEventListener("click", shufflePieces);

createPuzzle();
