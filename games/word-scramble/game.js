(() => {
  const scrambledWordEl = document.getElementById("scrambledWord");
  if (!scrambledWordEl) return; // 🛑 failsafe

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

  checkBtn.onclick = () => {
    const answer = userInput.value.toLowerCase().trim();

    if (!answer) {
      message.textContent = "✏️ Type a word!";
      message.style.color = "orange";
      return;
    }

    if (answer === currentWord) {
      score++;
      scoreEl.textContent = score;
      message.textContent = "🎉 Correct!";
      message.style.color = "green";
    } else {
      message.textContent = "😊 Try again!";
      message.style.color = "red";
    }
  };

  nextBtn.onclick = loadNewWord;

  levelButtons.forEach(btn => {
    btn.onclick = () => {
      currentLevel = btn.dataset.level;
      score = 0;
      scoreEl.textContent = score;
      loadNewWord();
    };
  });

  loadNewWord();
})();
