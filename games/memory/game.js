const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");
const timeEl = document.getElementById("time");
const levelSelect = document.getElementById("level");
const winModal = document.getElementById("winModal");
const winMessage = document.getElementById("winMessage");
const closeModal = document.getElementById("closeModal");

const iconPool = ["🍎","🍌","🍇","🍒","🍓","🥝","🍍","🍉","🍑","🥭","🍋","🍊","🍐","🍈","🍏","🥥","🥑","🌽"];

let cards = [], flipped = [], moves = 0, lock = false;
let time = 0, timer = null;

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    time++;
    timeEl.textContent = time;
  }, 1000);
}
function stopTimer() { clearInterval(timer); timer = null; }

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  const size = Number(levelSelect.value);
  const totalCards = size * size;
  const pairCount = totalCards / 2;

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  moves = 0; time = 0; flipped = []; lock = false;
  movesEl.textContent = moves; timeEl.textContent = time;
  stopTimer();

  const selectedIcons = iconPool.slice(0, pairCount);
  cards = shuffle([...selectedIcons, ...selectedIcons]);

  const frag = document.createDocumentFragment();
  cards.forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.icon = icon;
    card.textContent = "";
    card.addEventListener("click", () => flipCard(card));
    card.addEventListener("touchstart", () => flipCard(card));
    frag.appendChild(card);
  });
  grid.appendChild(frag);
}

function flipCard(card) {
  if (lock || card.classList.contains("flipped") || card.classList.contains("matched")) return;
  startTimer();
  card.textContent = card.dataset.icon;
  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    moves++; movesEl.textContent = moves;
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
      winMessage.textContent = `🎉 You won in ${moves} moves and ${time} seconds!`;
      winModal.classList.remove("hidden");
    }
  } else {
    lock = true;
    setTimeout(() => {
      a.textContent = ""; b.textContent = "";
      a.classList.remove("flipped"); b.classList.remove("flipped");
      flipped = []; lock = false;
    }, 800);
  }
}

restartBtn.addEventListener("click", createBoard);
levelSelect.addEventListener("change", createBoard);
closeModal.addEventListener("click", () => winModal.classList.add("hidden"));

createBoard();
