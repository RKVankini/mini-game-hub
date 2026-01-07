/* ================= QUESTION BANK ================= */

const QUIZ = {
  devops: [
    {
      q: "What does CI/CD stand for?",
      options: [
        "Continuous Integration / Continuous Deployment",
        "Cloud Infrastructure / Cloud Delivery",
        "Code Integration / Code Deployment",
        "Continuous Improvement / Continuous Design"
      ],
      answer: 0,
      explanation: "CI/CD automates build, testing, and deployment."
    },
    {
      q: "Which AWS service is used for object storage?",
      options: ["EC2", "RDS", "S3", "Lambda"],
      answer: 2,
      explanation: "Amazon S3 is designed for object storage."
    }
  ],

  technical: [
    {
      q: "Which language runs in the browser?",
      options: ["Python", "C", "JavaScript", "Java"],
      answer: 2,
      explanation: "JavaScript runs directly inside web browsers."
    },
    {
      q: "What does CSS stand for?",
      options: [
        "Computer Style Sheets",
        "Creative Style System",
        "Cascading Style Sheets",
        "Colorful Style Sheets"
      ],
      answer: 2,
      explanation: "CSS stands for Cascading Style Sheets."
    }
  ],

  fun: [
    {
      q: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: 1,
      explanation: "Mars appears red due to iron oxide on its surface."
    },
    {
      q: "How many colors are there in a rainbow?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explanation: "A rainbow has seven colors."
    }
  ]
};

/* ================= ELEMENTS ================= */

const categoryBox = document.getElementById("categoryBox");
const difficultyBox = document.getElementById("difficultyBox");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timeEl = document.getElementById("time");
const scoreEl = document.getElementById("score");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartQuiz");
const progressBar = document.getElementById("progressBar");

/* ================= STATE ================= */

let questions = [];
let index = 0;
let score = 0;
let timeLimit = 10;
let time = 0;
let timer = null;
let answered = false;

/* ================= HELPERS ================= */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ================= CATEGORY ================= */

document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    questions = shuffle([...QUIZ[btn.dataset.type]]);
    categoryBox.classList.add("hidden");
    difficultyBox.classList.remove("hidden");
  };
});

/* ================= DIFFICULTY ================= */

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.onclick = () => {
    timeLimit = Number(btn.dataset.time);
    difficultyBox.classList.add("hidden");
    startQuiz();
  };
});

/* ================= QUIZ ================= */

function startQuiz() {
  quizBox.classList.remove("hidden");
  index = 0;
  score = 0;
  scoreEl.textContent = score;
  updateProgress();
  loadQuestion();
}

function startTimer() {
  clearInterval(timer);
  time = timeLimit;
  timeEl.textContent = time;

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time === 0) {
      clearInterval(timer);
      answered = true;
      nextBtn.disabled = false;
    }
  }, 1000);
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;
  optionsEl.innerHTML = "";
  explanationEl.classList.add("hidden");

  const q = questions[index];
  questionEl.textContent = q.q;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function checkAnswer(selected) {
  if (answered) return;
  answered = true;

  clearInterval(timer);
  const correct = questions[index].answer;

  document.querySelectorAll(".option").forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add("correct");
    if (i === selected && i !== correct) btn.classList.add("wrong");
  });

  explanationEl.textContent = questions[index].explanation;
  explanationEl.classList.remove("hidden");

  if (selected === correct) {
    score++;
    scoreEl.textContent = score;
  }

  nextBtn.disabled = false;
}

nextBtn.onclick = () => {
  index++;
  if (index < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

function updateProgress() {
  progressBar.style.width = `${(index / questions.length) * 100}%`;
}

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  finalScoreEl.textContent = `${score} / ${questions.length}`;
}

/* ================= RESET ================= */

restartBtn.onclick = () => {
  resultBox.classList.add("hidden");
  categoryBox.classList.remove("hidden");
};
