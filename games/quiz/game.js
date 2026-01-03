const questions = [
  {
    q: "Which language runs in the browser?",
    options: ["Python", "C", "JavaScript", "Java"],
    answer: 2
  },
  {
    q: "What does CSS stand for?",
    options: [
      "Computer Style Sheets",
      "Creative Style System",
      "Cascading Style Sheets",
      "Colorful Style Sheets"
    ],
    answer: 2
  },
  {
    q: "Which HTML tag is used for JavaScript?",
    options: ["<js>", "<script>", "<javascript>", "<code>"],
    answer: 1
  },
  {
    q: "Which method is used to fetch data?",
    options: ["get()", "fetch()", "pull()", "request()"],
    answer: 1
  }
];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");
const resultBox = document.getElementById("result");
const quizBox = document.getElementById("quiz-box");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartQuiz");

let index = 0;
let score = 0;
let time = 10;
let timer = null;

function startTimer() {
  clearInterval(timer);
  time = 10;
  timeEl.textContent = time;

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;

    if (time === 0) {
      clearInterval(timer);
      nextBtn.disabled = false;
    }
  }, 1000);
}

function loadQuestion() {
  nextBtn.disabled = true;
  optionsEl.innerHTML = "";

  const current = questions[index];
  questionEl.textContent = current.q;

  current.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;

    btn.onclick = () => checkAnswer(btn, i);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(button, selected) {
  clearInterval(timer);
  const correct = questions[index].answer;

  document.querySelectorAll(".option").forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  if (selected === correct) {
    score++;
    scoreEl.textContent = score;
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener("click", () => {
  index++;
  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${questions.length}`;
}

restartBtn.addEventListener("click", () => {
  index = 0;
  score = 0;
  scoreEl.textContent = score;
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  loadQuestion();
});

/* INIT */
loadQuestion();
