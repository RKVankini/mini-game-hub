const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const gridSizeSelect = document.getElementById("gridSize");
const previewImg = document.getElementById("previewImage");
const winModal = document.getElementById("winModal");
const playAgainBtn = document.getElementById("playAgain");

/* ---------- IMAGE POOL ---------- */

const IMAGES = [
  "assets/images/puzzle1.jpg",
  "assets/images/puzzle2.jpg",
  "assets/images/puzzle3.jpg"
];

let currentImage = "";

/* ---------- STATE ---------- */

let tiles = [];
let moves = 0;
let time = 0;
let timer = null;
let SIZE = 3;

/* ---------- INIT ---------- */

function init() {
  moves = 0;
  time = 0;
  movesEl.textContent = moves;
  timeEl.textContent = time;
  stopTimer();
  winModal.classList.add("hidden");

  SIZE = Number(gridSizeSelect.value);
  grid.style.gridTemplateColumns = `repeat(${SIZE}, 1fr)`;

  currentImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  previewImg.src = currentImage;

  tiles = [...Array(SIZE * SIZE - 1).keys()].map(n => n + 1);
  tiles.push(null);

  shuffleSolvable(tiles);
  render();
}

/* ---------- TIMER ---------- */

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    time++;
    timeEl.textContent = time;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

/* ---------- SOLVABLE SHUFFLE ---------- */

function shuffleSolvable(arr) {
  do {
    shuffle(arr);
  } while (!isSolvable(arr));
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function isSolvable(arr) {
  let inv = 0;
  const nums = arr.filter(n => n !== null);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > nums[j]) inv++;
    }
  }
  return inv % 2 === 0;
}

/* ---------- RENDER ---------- */

function render() {
  grid.innerHTML = "";

  tiles.forEach((value, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    if (value === null) {
      tile.classList.add("empty");
    } else {
      const row = Math.floor((value - 1) / SIZE);
      const col = (value - 1) % SIZE;

      tile.style.backgroundImage = `url(${currentImage})`;
      tile.style.backgroundSize = `${SIZE * 100}% ${SIZE * 100}%`;
      tile.style.backgroundPosition =
        `${(col * 100) / (SIZE - 1)}% ${(row * 100) / (SIZE - 1)}%`;

      tile.onclick = () => moveTile(index);
    }

    grid.appendChild(tile);
  });
}

/* ---------- MOVE (TAP) ---------- */

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const valid = getValidMoves(emptyIndex);
  if (!valid.includes(index)) return;

  startTimer();
  swap(index, emptyIndex);
}

/* ---------- MOVE (SWIPE) ---------- */

let startX = 0;
let startY = 0;

grid.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startX = t.clientX;
  startY = t.clientY;
});

grid.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX;
  const dy = t.clientY - startY;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

  const empty = tiles.indexOf(null);
  const row = Math.floor(empty / SIZE);
  const col = empty % SIZE;

  let target = null;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && col > 0) target = empty - 1;        // swipe right
    if (dx < 0 && col < SIZE - 1) target = empty + 1; // swipe left
  } else {
    if (dy > 0 && row > 0) target = empty - SIZE;     // swipe down
    if (dy < 0 && row < SIZE - 1) target = empty + SIZE; // swipe up
  }

  if (target !== null) {
    startTimer();
    swap(target, empty);
  }
});

/* ---------- HELPERS ---------- */

function swap(a, b) {
  [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
  moves++;
  movesEl.textContent = moves;
  render();
  checkWin();
}

function getValidMoves(empty) {
  const row = Math.floor(empty / SIZE);
  const col = empty % SIZE;
  const moves = [];

  if (row > 0) moves.push(empty - SIZE);
  if (row < SIZE - 1) moves.push(empty + SIZE);
  if (col > 0) moves.push(empty - 1);
  if (col < SIZE - 1) moves.push(empty + 1);

  return moves;
}

/* ---------- WIN ---------- */

function checkWin() {
  const solved = tiles.slice(0, SIZE * SIZE - 1)
    .every((v, i) => v === i + 1);

  if (!solved) return;

  stopTimer();
  document.getElementById("resultText").textContent =
    `Solved in ${moves} moves and ${time}s`;

  winModal.classList.remove("hidden");
}

/* ---------- EVENTS ---------- */

restartBtn.onclick = init;
playAgainBtn.onclick = init;
gridSizeSelect.onchange = init;

/* ---------- START ---------- */

init();
