/* ======================================================
   QUIZ GAME – FINAL STABLE BUILD (SOUND FIXED)
   ====================================================== */

/* ================= SOUND ENGINE ================= */

// Sounds are created immediately BUT only played after user interaction
const sounds = {
  click: new Audio("../../assets/sounds/click.mp3"),
  correct: new Audio("../../assets/sounds/correct.mp3"),
  wrong: new Audio("../../assets/sounds/wrong.mp3"),
  timeout: new Audio("../../assets/sounds/timeout.mp3"),
  win: new Audio("../../assets/sounds/win.mp3")
};

// Set volume
Object.values(sounds).forEach(s => (s.volume = 0.6));

// Unlock audio after first user interaction
let audioUnlocked = false;
document.addEventListener(
  "click",
  () => {
    audioUnlocked = true;
    sounds.click.play().catch(() => {});
  },
  { once: true }
);

function playSound(name) {
  if (!audioUnlocked || !sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play().catch(() => {});
}

/* ================= CONFIG ================= */

const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
};

/* ================= QUESTIONS ================= */

const QUESTIONS = {
  fun: [
    { q: "Which planet is known as the Red Planet?", options: ["Earth","Mars","Jupiter","Venus"], answer: 1, explanation: "Mars looks red due to iron oxide." },
    { q: "How many colors are there in a rainbow?", options: ["5","6","7","8"], answer: 2, explanation: "A rainbow has 7 colors." },
    { q: "Ship of the desert?", options: ["Horse","Camel","Donkey","Elephant"], answer: 1, explanation: "Camel survives in deserts." },
    { q: "King of fruits in India?", options: ["Apple","Banana","Mango","Orange"], answer: 2, explanation: "Mango is the king of fruits." },
    { q: "Leap year days?", options: ["365","366","364","360"], answer: 1, explanation: "Leap year has 366 days." },
    { q: "Largest ocean?", options: ["Atlantic","Indian","Pacific","Arctic"], answer: 2, explanation: "Pacific is the largest." },
    { q: "National bird of India?", options: ["Sparrow","Peacock","Crow","Eagle"], answer: 1, explanation: "Peacock is national bird." },
    { q: "How many continents?", options: ["5","6","7","8"], answer: 2, explanation: "There are 7 continents." },
    { q: "Which month has 28 days?", options: ["February","All months","January","March"], answer: 1, explanation: "All months have 28 days." },
    { q: "Tallest animal?", options: ["Elephant","Horse","Camel","Giraffe"], answer: 3, explanation: "Giraffe is tallest." }
  ],

  technical: [
    { q: "Which language runs in browser?", options: ["Python","C","JavaScript","Java"], answer: 2, explanation: "JavaScript runs in browser." },
    { q: "CSS full form?", options: ["A","B","Cascading Style Sheets","D"], answer: 2, explanation: "CSS stands for Cascading Style Sheets." },
    { q: "JS variable keyword?", options: ["int","var","let","define"], answer: 2, explanation: "let declares variables." },
    { q: "JSON parse method?", options: ["parse","JSON.parse()","convert","read"], answer: 1, explanation: "JSON.parse converts JSON to object." },
    { q: "Strict comparison?", options: ["=","==","===","!="], answer: 2, explanation: "=== checks value & type." },
    { q: "Add to array?", options: ["pop","push","shift","slice"], answer: 1, explanation: "push adds items." },
    { q: "Stop loop?", options: ["exit","break","stop","end"], answer: 1, explanation: "break stops loop." },
    { q: "Boolean stores?", options: ["Text","True/False","Number","Object"], answer: 1, explanation: "Boolean stores true/false." },
    { q: "Link tag?", options: ["<a>","<link>","<href>","<url>"], answer: 0, explanation: "<a> tag creates links." },
    { q: "JS comments?", options: ["##","//","<!--","**"], answer: 1, explanation: "// is JS comment." }
  ],

  devops: [
    { q: "CI/CD means?", options: ["A","B","Continuous Integration / Deployment","D"], answer: 2, explanation: "CI/CD automates build & deploy." },
    { q: "AWS object storage?", options: ["EC2","RDS","S3","Lambda"], answer: 2, explanation: "S3 is object storage." },
    { q: "List running containers?", options: ["docker ps","docker run","docker build","docker img"], answer: 0, explanation: "docker ps lists containers." },
    { q: "Serverless service?", options: ["EC2","RDS","Lambda","EBS"], answer: 2, explanation: "Lambda is serverless." },
    { q: "IaC tool?", options: ["Docker","Terraform","Git","Linux"], answer: 1, explanation: "Terraform is IaC." },
    { q: "HTTP port?", options: ["21","22","80","443"], answer: 2, explanation: "HTTP uses port 80." },
    { q: "DNS service?", options: ["Route53","S3","VPC","ELB"], answer: 0, explanation: "Route53 provides DNS." },
    { q: "K8s smallest unit?", options: ["Node","Pod","Service","Cluster"], answer: 1, explanation: "Pod is smallest." },
    { q: "Secrets storage?", options: ["S3","IAM","Secrets Manager","CloudTrail"], answer: 2, explanation: "Secrets Manager stores secrets." },
    { q: "CI tool?", options: ["Git","Jenkins","Linux","Docker"], answer: 1, explanation: "Jenkins is CI tool." }
  ]
};

/* ================= ENGINE ================= */

const els = {
  categoryBox: document.getElementById("categoryBox"),
  difficultyBox: document.getElementById("difficultyBox"),
  quizBox: document.getElementById("quizBox"),
  resultBox: document.getElementById("resultBox"),
  question: document.getElementById("question"),
  options: document.getElementById("options"),
  time: document.getElementById("time"),
  score: document.getElementById("score"),
  explanation: document.getElementById("explanation"),
  next: document.getElementById("nextBtn"),
  progress: document.getElementById("progressBar"),
  finalScore: document.getElementById("finalScore"),
  bestScore: document.getElementById("bestScore"),
  restart: document.getElementById("restartQuiz")
};

let category = "";
let difficulty = "";
let questions = [];
let index = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answered = false;

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* CATEGORY */
document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    playSound("click");
    category = btn.dataset.type;
    els.categoryBox.classList.add("hidden");
    els.difficultyBox.classList.remove("hidden");
  };
});

/* DIFFICULTY */
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.onclick = () => {
    playSound("click");
    difficulty = btn.textContent.toLowerCase();
    startQuiz();
  };
});

function startQuiz() {
  const cfg = DIFFICULTY[difficulty];
  questions = shuffle([...QUESTIONS[category]]).slice(0, cfg.count);
  index = 0;
  score = 0;
  els.score.textContent = score;
  els.difficultyBox.classList.add("hidden");
  els.quizBox.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  els.options.innerHTML = "";
  els.explanation.classList.add("hidden");
  els.next.disabled = true;

  const q = questions[index];
  els.question.textContent = q.q;

  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = opt;
    btn.onclick = () => selectAnswer(i);
    els.options.appendChild(btn);
  });

  els.progress.style.width = `${((index + 1) / questions.length) * 100}%`;
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = DIFFICULTY[difficulty].time;
  els.time.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    els.time.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(timer);
      playSound("timeout");
      els.next.disabled = false;
    }
  }, 1000);
}

function selectAnswer(sel) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].answer;

  document.querySelectorAll(".option").forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add("correct");
    if (i === sel && i !== correct) b.classList.add("wrong");
  });

  if (sel === correct) {
    playSound("correct");
    score++;
    els.score.textContent = score;
  } else {
    playSound("wrong");
  }

  els.explanation.textContent = questions[index].explanation;
  els.explanation.classList.remove("hidden");
  els.next.disabled = false;
}

els.next.onclick = () => {
  index++;
  index < questions.length ? loadQuestion() : showResult();
};

function showResult() {
  playSound("win");
  els.quizBox.classList.add("hidden");
  els.resultBox.classList.remove("hidden");

  els.finalScore.textContent = `${score} / ${questions.length}`;

  const key = `best_${category}_${difficulty}`;
  const best = localStorage.getItem(key) || 0;
  if (score > best) localStorage.setItem(key, score);
  els.bestScore.textContent = `Best Score: ${localStorage.getItem(key)}`;
}

els.restart.onclick = () => location.reload();
