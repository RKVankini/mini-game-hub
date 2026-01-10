(() => {
  const scrambledWordEl = document.getElementById("scrambledWord");
  if (!scrambledWordEl) return;

  const userInput = document.getElementById("userInput");
  const message = document.getElementById("message");
  const starsEl = document.getElementById("stars");
  const checkBtn = document.getElementById("checkBtn");
  const nextBtn = document.getElementById("nextBtn");
  const roundEl = document.getElementById("round");
  const imgEl = document.getElementById("wordImage");

  const teacherBtn = document.getElementById("teacherBtn");
  const teacherInput = document.getElementById("teacherInput");
  const applyWords = document.getElementById("applyWords");

  const levelButtons = document.querySelectorAll(".level-select button");

  const sounds = {
    correct: new Audio("assets/sounds/correct.mp3"),
    wrong: new Audio("assets/sounds/wrong.mp3"),
    win: new Audio("assets/sounds/win.mp3")
  };

  const MAX_ROUNDS = 10;
  let round = 1;
  let stars = 0;
  let answered = false;
  let level = "easy";
  let currentWord = "";
  let currentImg = "";

  const words = {
    easy: [
      { word: "cat", img: "assets/images/cat.png" },
      { word: "dog", img: "assets/images/dog.png" },
      { word: "sun", img: "assets/images/sun.png" },
      { word: "book", img: "assets/images/book.png" }
    ],
    medium: ["school", "teacher", "planet", "computer"],
    hard: ["environment", "electricity", "geography", "technology"]
  };

  function scramble(word) {
    return word.split("").sort(() => Math.random() - 0.5).join("");
  }

  function badge(stars) {
    if (stars <= 3) return "🥉 Beginner";
    if (stars <= 7) return "🥈 Smart";
    return "🥇 Genius";
  }

  function renderStars() {
    starsEl.textContent = "⭐".repeat(stars);
  }

  function newRound() {
    if (round > MAX_ROUNDS) {
      sounds.win.play();
      message.innerHTML = `
        🎉 Challenge Complete!<br>
        Badge Earned: <b>${badge(stars)}</b>
      `;
      checkBtn.disabled = true;
      nextBtn.disabled = true;
      imgEl.style.display = "none";
      return;
    }

    roundEl.textContent = round;
    answered = false;
    message.textContent = "";
    userInput.value = "";

    if (level === "easy") {
      const item = words.easy[Math.floor(Math.random() * words.easy.length)];
      currentWord = item.word;
      currentImg = item.img;
      imgEl.src = currentImg;
      imgEl.style.display = "block";
    } else {
      const list = words[level];
      currentWord = list[Math.floor(Math.random() * list.length)];
      imgEl.style.display = "none";
    }

    scrambledWordEl.textContent = scramble(currentWord);
  }

  checkBtn.onclick = () => {
    if (answered) return;

    const input = userInput.value.toLowerCase().trim();
    if (!input) return;

    if (input === currentWord) {
      sounds.correct.play();
      stars++;
      renderStars();
      message.textContent = "🎉 Correct!";
      message.style.color = "green";
      answered = true;
      round++;
    } else {
      sounds.wrong.play();
      message.textContent = "😊 Try again!";
      message.style.color = "orange";
    }
  };

  nextBtn.onclick = newRound;

  levelButtons.forEach(btn => {
    btn.onclick = () => {
      level = btn.dataset.level;
      stars = 0;
      round = 1;
      checkBtn.disabled = false;
      nextBtn.disabled = false;
      renderStars();
      newRound();
    };
  });

  teacherBtn.onclick = () => {
    teacherInput.style.display = "block";
    applyWords.style.display = "block";
  };

  applyWords.onclick = () => {
    const custom = teacherInput.value
      .split(",")
      .map(w => w.trim())
      .filter(Boolean);

    if (custom.length) {
      words.custom = custom;
      level = "custom";
      stars = 0;
      round = 1;
      renderStars();
      newRound();
    }
  };

  renderStars();
  newRound();
})();
