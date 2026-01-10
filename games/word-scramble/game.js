const scrambledWordEl = document.getElementById("scrambledWord");
const userInput = document.getElementById("userInput");
const message = document.getElementById("message");
const scoreEl = document.getElementById("score");

const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");
const levelButtons = document.querySelectorAll(".level-select button");

let score = 0;
let currentWord = "";
let currentLevel = "easy";

const words = {
  easy: ["cat", "dog", "sun", "pen", "book", "tree"],
  medium: ["school", "teacher", "planet", "computer", "science"],
  hard: ["environment", "electricity", "geography", "technology"]
};

function scramble(word) {
  return word.split("").sort(() => Math.random() - 0.5).join("");
}

function loadNewWord() {
  const list = words[currentLevel];
  currentWord = list[Math.floor(Math.random() * list.length)];
  scrambledWordEl.textContent = scramble(currentWord);
  userInput.value = "";
  message.textContent = "";
}

checkBtn.addEventListener("click", () => {
  const answer = userInput.value.toLowerCase().trim();

  if (!answer) {
    message.textContent = "✏️ Please type a word!";
    message.style.color = "orange";
    return;
  }

  if (answer === currentWord) {
    score++;
    scoreEl.textContent = score;
    message.textContent = "🎉 Correct! Well done!";
    message.style.color = "green";
  } else {
    message.textContent = "😊 Try again, you can do it!";
    message.style.color = "red";
  }
});

nextBtn.addEventListener("click", loadNewWord);

levelButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentLevel = btn.dataset.level;
    score = 0;
    scoreEl.textContent = score;
    loadNewWord();
  });
});

// Start game
loadNewWord();
