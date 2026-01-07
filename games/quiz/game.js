/* ================= QUESTION BANK ================= */

const QUESTIONS = {
  fun: [
    {
      q: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      answer: 1,
      explanation: "Mars looks red due to iron oxide on its surface."
    },
    {
      q: "How many colors are there in a rainbow?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explanation: "A rainbow has seven colors."
    },
    {
      q: "Which animal is called the Ship of the Desert?",
      options: ["Horse", "Camel", "Donkey", "Elephant"],
      answer: 1,
      explanation: "Camels are adapted to desert life."
    },
    {
      q: "Which fruit is known as the King of Fruits in India?",
      options: ["Apple", "Banana", "Mango", "Orange"],
      answer: 2,
      explanation: "Mango is called the King of Fruits."
    },
    {
      q: "How many days are there in a leap year?",
      options: ["365", "366", "364", "360"],
      answer: 1,
      explanation: "Leap years have 366 days."
    },
    {
      q: "Which day comes after Friday?",
      options: ["Thursday", "Saturday", "Sunday", "Monday"],
      answer: 1,
      explanation: "Saturday comes after Friday."
    },
    {
      q: "Which is the largest ocean?",
      options: ["Atlantic", "Indian", "Pacific", "Arctic"],
      answer: 2,
      explanation: "The Pacific Ocean is the largest."
    },
    {
      q: "Which bird is the national bird of India?",
      options: ["Sparrow", "Peacock", "Eagle", "Crow"],
      answer: 1,
      explanation: "Peacock is the national bird of India."
    },
    {
      q: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      answer: 2,
      explanation: "There are seven continents."
    },
    {
      q: "Which month has 28 days?",
      options: ["February", "All months", "January", "March"],
      answer: 1,
      explanation: "All months have at least 28 days."
    },

    /* extra for medium & hard */
    {
      q: "Which gas do plants absorb?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      answer: 1,
      explanation: "Plants absorb CO₂ for photosynthesis."
    },
    {
      q: "Which metal is liquid at room temperature?",
      options: ["Iron", "Mercury", "Copper", "Silver"],
      answer: 1,
      explanation: "Mercury is liquid at room temperature."
    },
    {
      q: "Which festival is called the Festival of Lights?",
      options: ["Holi", "Diwali", "Eid", "Christmas"],
      answer: 1,
      explanation: "Diwali is known as the Festival of Lights."
    },
    {
      q: "Which sport uses a shuttlecock?",
      options: ["Cricket", "Badminton", "Football", "Tennis"],
      answer: 1,
      explanation: "Badminton uses a shuttlecock."
    },
    {
      q: "How many letters are there in the English alphabet?",
      options: ["24", "25", "26", "27"],
      answer: 2,
      explanation: "There are 26 letters."
    },
    {
      q: "Which shape has 3 sides?",
      options: ["Square", "Triangle", "Circle", "Rectangle"],
      answer: 1,
      explanation: "A triangle has three sides."
    },
    {
      q: "Which instrument has keys and pedals?",
      options: ["Guitar", "Drum", "Piano", "Violin"],
      answer: 2,
      explanation: "A piano has keys and pedals."
    },
    {
      q: "Which country gifted the Statue of Liberty?",
      options: ["UK", "France", "Germany", "Italy"],
      answer: 1,
      explanation: "France gifted it to the USA."
    },
    {
      q: "How many hours are there in a day?",
      options: ["12", "18", "24", "48"],
      answer: 2,
      explanation: "A day has 24 hours."
    },
    {
      q: "Which is the tallest animal?",
      options: ["Elephant", "Horse", "Camel", "Giraffe"],
      answer: 3,
      explanation: "Giraffe is the tallest land animal."
    }
  ],

  technical: [
    {
      q: "Which language runs in the browser?",
      options: ["Python", "C", "JavaScript", "Java"],
      answer: 2,
      explanation: "JavaScript runs in browsers."
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
      explanation: "CSS means Cascading Style Sheets."
    },
    {
      q: "Which HTML tag is used for JavaScript?",
      options: ["<js>", "<script>", "<javascript>", "<code>"],
      answer: 1,
      explanation: "The <script> tag is used."
    },
    {
      q: "Which keyword declares a variable?",
      options: ["int", "var", "define", "let"],
      answer: 3,
      explanation: "`let` declares a variable."
    },
    {
      q: "Which method parses JSON?",
      options: ["JSON.parse()", "JSON.stringify()", "parse()", "convert()"],
      answer: 0,
      explanation: "JSON.parse() converts JSON to object."
    },

    /* add more for medium & hard */
    {
      q: "Which operator checks value and type?",
      options: ["==", "=", "===", "!="],
      answer: 2,
      explanation: "`===` checks value and type."
    },
    {
      q: "Which array method adds elements?",
      options: ["push()", "pop()", "shift()", "slice()"],
      answer: 0,
      explanation: "push() adds elements."
    },
    {
      q: "Which keyword stops a loop?",
      options: ["exit", "stop", "break", "end"],
      answer: 2,
      explanation: "`break` stops a loop."
    },
    {
      q: "Which data type stores true/false?",
      options: ["String", "Boolean", "Number", "Object"],
      answer: 1,
      explanation: "Boolean stores true/false."
    },
    {
      q: "Which tag creates a link?",
      options: ["<a>", "<link>", "<href>", "<url>"],
      answer: 0,
      explanation: "<a> creates a link."
    }
  ],

  devops: [
    {
      q: "What does CI/CD stand for?",
      options: [
        "Continuous Integration / Continuous Deployment",
        "Cloud Infrastructure",
        "Code Delivery",
        "Continuous Design"
      ],
      answer: 0,
      explanation: "CI/CD automates build and deployment."
    },
    {
      q: "Which AWS service is object storage?",
      options: ["EC2", "RDS", "S3", "Lambda"],
      answer: 2,
      explanation: "S3 is object storage."
    },
    {
      q: "Which command lists running containers?",
      options: ["docker ps", "docker images", "docker run", "docker build"],
      answer: 0,
      explanation: "`docker ps` lists running containers."
    },
    {
      q: "Which tool is used for orchestration?",
      options: ["Docker", "Kubernetes", "Jenkins", "Ansible"],
      answer: 1,
      explanation: "Kubernetes handles orchestration."
    },
    {
      q: "Which AWS service is serverless?",
      options: ["EC2", "RDS", "Lambda", "EBS"],
      answer: 2,
      explanation: "Lambda is serverless."
    }
  ]
};

/* ================= CONFIG ================= */

const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
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

let selectedCategory = "";
let selectedDifficulty = "";
let questions = [];
let index = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answered = false;

/* ================= HELPERS ================= */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ================= CATEGORY ================= */

document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    selectedCategory = btn.dataset.type;
    categoryBox.classList.add("hidden");
    difficultyBox.classList.remove("hidden");
  };
});

/* ================= DIFFICULTY ================= */

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.onclick = () => {
    selectedDifficulty = btn.textContent.toLowerCase();
    startQuiz();
  };
});

/* ================= QUIZ ================= */

function startQuiz() {
  const config = DIFFICULTY[selectedDifficulty];

  questions = shuffle([...QUESTIONS[selectedCategory]]).slice(0, config.count);
  index = 0;
  score = 0;

  scoreEl.textContent = score;

  difficultyBox.classList.add("hidden");
  quizBox.classList.remove("hidden");

  loadQuestion();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = DIFFICULTY[selectedDifficulty].time;
  timeEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      lockQuestion();
    }
  }, 1000);
}

function loadQuestion() {
  answered = false;
  nextBtn.disabled = true;
  explanationEl.classList.add("hidden");
  optionsEl.innerHTML = "";

  const q = questions[index];
  questionEl.textContent = q.q;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    optionsEl.appendChild(btn);
  });

  updateProgress();
  startTimer();
}

function selectAnswer(selected) {
  if (answered) return;
  answered = true;

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

  explanationEl.textContent = questions[index].explanation;
  explanationEl.classList.remove("hidden");

  nextBtn.disabled = false;
}

function lockQuestion() {
  answered = true;
  explanationEl.textContent = "⏱️ Time’s up!";
  explanationEl.classList.remove("hidden");
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
  progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
}

/* ================= RESULT ================= */

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  finalScoreEl.textContent = `${score} / ${questions.length}`;

  const key = `best_${selectedCategory}_${selectedDifficulty}`;
  const best = localStorage.getItem(key);

  if (!best || score > best) {
    localStorage.setItem(key, score);
  }
}

/* ================= RESET ================= */

restartBtn.onclick = () => {
  resultBox.classList.add("hidden");
  categoryBox.classList.remove("hidden");
};
