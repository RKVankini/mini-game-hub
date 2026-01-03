const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const timeEl = document.getElementById("time");

const icons = ["🍎","🍌","🍇","🍒","🍓","🥝","🍍","🍉"];
let cards = [...icons, ...icons];

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
  grid.innerHTML = "";

  moves = 0;
  time = 0;
  flipped = [];
  lock = false;

  movesEl.textContent = moves;
  timeEl.textContent = time;

  stopTimer();

  shuffle(cards).forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "";
    card.dataset.icon = icon;

    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

/* ---------- GAME LOGIC ---------- */
function flipCard(card) {
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) {
    return;
  }

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

    // ✅ WIN CHECK
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

/* ---------- INIT ---------- */
createBoard();
