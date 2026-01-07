const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const restartBtn = document.getElementById("restart");
const winModal = document.getElementById("winModal");

const moveSound = new Audio("assets/sounds/move.mp3");
const winSound = new Audio("assets/sounds/win.mp3");

let tiles = [];
let moves = 0;
let time = 0;
let timer = null;

/* ---------- INIT ---------- */

function restartGame() {
  winModal.classList.add("hidden");
  init();
}

function init() {
  moves = 0;
  time = 0;
  movesEl.textContent = moves;
  timeEl.textContent = time;

  stopTimer();

  tiles = [...Array(8).keys()].map(n => n + 1);
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
      tile.textContent = value;
      tile.onclick = () => moveTile(index);
    }

    grid.appendChild(tile);
  });
}

/* ---------- MOVE ---------- */

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const valid = getValidMoves(emptyIndex);

  if (!valid.includes(index)) return;

  startTimer();
  moveSound.currentTime = 0;
  moveSound.play();

  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  moves++;
  movesEl.textContent = moves;

  render();
  checkWin();
}

/* ---------- HELPERS ---------- */

function getValidMoves(empty) {
  const moves = [];
  const row = Math.floor(empty / 3);
  const col = empty % 3;

  if (row > 0) moves.push(empty - 3);
  if (row < 2) moves.push(empty + 3);
  if (col > 0) moves.push(empty - 1);
  if (col < 2) moves.push(empty + 1);

  return moves;
}

/* ---------- WIN ---------- */

function checkWin() {
  const solved = tiles.slice(0, 8).every((v, i) => v === i + 1);
  if (!solved) return;

  stopTimer();
  winSound.play();

  saveBestScore();

  const best = getBestScore();
  document.getElementById("resultText").textContent =
    `Solved in ${moves} moves and ${time}s`;
  document.getElementById("bestText").textContent =
    `Best: ${best.moves} moves in ${best.time}s`;

  winModal.classList.remove("hidden");
}

/* ---------- BEST SCORE ---------- */

function saveBestScore() {
  const best = JSON.parse(localStorage.getItem("sliding_best"));
  if (!best || moves < best.moves || (moves === best.moves && time < best.time)) {
    localStorage.setItem("sliding_best", JSON.stringify({ moves, time }));
  }
}

function getBestScore() {
  return JSON.parse(localStorage.getItem("sliding_best"));
}

/* ---------- EVENTS ---------- */

restartBtn.onclick = init;

/* ---------- START ---------- */

init();
