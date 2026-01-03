const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const timeEl = document.getElementById("time");
const levelSelect = document.getElementById("level");

/* ICON POOL */
const iconPool = [
  "🍎","🍌","🍇","🍒","🍓","🥝","🍍","🍉",
  "🍑","🥭","🍋","🍊","🍐","🍈","🍏","🥥","🥑","🌽"
];

let cards = [];
let flipped = [];
let moves = 0;
let lock = false;

/* ---------- TIMER ---------- */
let time = 0;
let timer = null;

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

/* ---------- UTILS ---------- */
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

/* ---------- BOARD ---------- */
function createBoard() {
  const size = Number(levelSelect.value);   // 4 or 6
  const totalCards = size * size;
  const pairCount = totalCards / 2;

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  moves = 0;
  time = 0;
  flipped = [];
  lock = false;

  movesEl.textContent = moves;
  timeEl.textContent = time;

  stopTimer();

  const selectedIcons = iconPool.slice(0, pairCount);
  cards = [...selectedIcons, ...selectedIcons];

  shuffle(cards).forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    card.textContent = "";

    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

/* ---------- GAME LOGIC ---------- */
function flipCard(card) {
  if (
    lock ||
    card.classList.contains("flipped") ||
    card.classList.contains("matched")
  ) return;

  startTimer();

  card.textContent = card.dataset.icon;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;

  if (a.dataset.icon === b.dataset.icon) {
    a.classList.add("matched");
    b.classList.add("matched");
    flipped = [];

    if (document.querySelectorAll(".matched").length === cards.length) {
      stopTimer();
      setTimeout(() => {
        alert(`🎉 You won in ${moves} moves and ${time} seconds!`);
      }, 300);
    }
  } else {
    lock = true;
    setTimeout(() => {
      a.textContent = "";
      b.textContent = "";
      a.classList.remove("flipped");
      b.classList.remove("flipped");
      flipped = [];
      lock = false;
    }, 800);
  }
}

/* ---------- EVENTS ---------- */
restartBtn.addEventListener("click", createBoard);
levelSelect.addEventListener("change", createBoard);

/* ---------- INIT ---------- */
createBoard();
