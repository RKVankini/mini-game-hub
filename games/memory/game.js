const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const restartBtn = document.getElementById("restart");

const icons = ["🍎","🍌","🍇","🍒","🍓","🥝","🍍","🍉"];
let cards = [...icons, ...icons];
let flipped = [];
let moves = 0;
let lock = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  grid.innerHTML = "";
  moves = 0;
  movesEl.textContent = moves;
  flipped = [];
  lock = false;

  shuffle(cards).forEach(icon => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = "";
    card.dataset.icon = icon;

    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (lock || card.classList.contains("flipped")) return;

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
    setTimeout(() => {
      alert(`🎉 You won in ${moves} moves!`);
    }, 300);
  }
}else {
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

restartBtn.addEventListener("click", createBoard);

createBoard();
