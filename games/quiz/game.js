/* ======================================================
   QUIZ GAME – FINAL STABLE BUILD
   ====================================================== */

/* ---------------- QUESTION BANK ---------------- */

const QUESTIONS = {
  fun: [
    { q: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1, explanation: "Mars looks red due to iron oxide." },
    { q: "How many colors are there in a rainbow?", options: ["5", "6", "7", "8"], answer: 2, explanation: "A rainbow has 7 colors." },
    { q: "Which animal is called the Ship of the Desert?", options: ["Horse", "Camel", "Donkey", "Elephant"], answer: 1, explanation: "Camels survive in deserts." },
    { q: "Which fruit is the King of Fruits in India?", options: ["Apple", "Banana", "Mango", "Orange"], answer: 2, explanation: "Mango is called the King of Fruits." },
    { q: "How many days are in a leap year?", options: ["365", "366", "364", "360"], answer: 1, explanation: "Leap years have 366 days." },
    { q: "Which day comes after Friday?", options: ["Thursday", "Saturday", "Sunday", "Monday"], answer: 1, explanation: "Saturday comes after Friday." },
    { q: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], answer: 2, explanation: "Pacific Ocean is the largest." },
    { q: "Which bird is the national bird of India?", options: ["Sparrow", "Peacock", "Crow", "Eagle"], answer: 1, explanation: "Peacock is India's national bird." },
    { q: "How many continents are there?", options: ["5", "6", "7", "8"], answer: 2, explanation: "There are 7 continents." },
    { q: "Which month has 28 days?", options: ["February", "All months", "January", "March"], answer: 1, explanation: "All months have at least 28 days." },

    /* extra for medium & hard */
    { q: "Which gas do plants absorb?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1, explanation: "Plants absorb CO₂." },
    { q: "Which metal is liquid at room temperature?", options: ["Iron", "Mercury", "Copper", "Silver"], answer: 1, explanation: "Mercury is liquid." },
    { q: "Which festival is Festival of Lights?", options: ["Holi", "Diwali", "Eid", "Christmas"], answer: 1, explanation: "Diwali is Festival of Lights." },
    { q: "Which sport uses a shuttlecock?", options: ["Cricket", "Badminton", "Football", "Tennis"], answer: 1, explanation: "Badminton uses a shuttlecock." },
    { q: "How many letters are in English alphabet?", options: ["24", "25", "26", "27"], answer: 2, explanation: "There are 26 letters." },
    { q: "Which shape has 3 sides?", options: ["Square", "Triangle", "Circle", "Rectangle"], answer: 1, explanation: "Triangle has 3 sides." },
    { q: "Which instrument has keys and pedals?", options: ["Guitar", "Drum", "Piano", "Violin"], answer: 2, explanation: "Piano has keys and pedals." },
    { q: "Which country gifted Statue of Liberty?", options: ["UK", "France", "Germany", "Italy"], answer: 1, explanation: "France gifted it." },
    { q: "How many hours are in a day?", options: ["12", "18", "24", "48"], answer: 2, explanation: "A day has 24 hours." },
    { q: "Which is the tallest animal?", options: ["Elephant", "Horse", "Camel", "Giraffe"], answer: 3, explanation: "Giraffe is tallest." }
  ],

  technical: [
    { q: "Which language runs in the browser?", options: ["Python", "C", "JavaScript", "Java"], answer: 2, explanation: "JavaScript runs in browsers." },
    { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Creative Style System", "Cascading Style Sheets", "Colorful Style Sheets"], answer: 2, explanation: "CSS means Cascading Style Sheets." },
    { q: "Which HTML tag is used for JavaScript?", options: ["<js>", "<script>", "<javascript>", "<code>"], answer: 1, explanation: "<script> tag is used." },
    { q: "Which keyword declares a variable?", options: ["int", "var", "define", "let"], answer: 3, explanation: "let declares variables." },
    { q: "Which method parses JSON?", options: ["JSON.parse()", "JSON.stringify()", "parse()", "convert()"], answer: 0, explanation: "JSON.parse converts JSON to object." },
    { q: "Which operator checks value & type?", options: ["==", "=", "===", "!="], answer: 2, explanation: "=== checks value and type." },
    { q: "Which array method adds items?", options: ["push()", "pop()", "shift()", "slice()"], answer: 0, explanation: "push() adds items." },
    { q: "Which keyword stops a loop?", options: ["exit", "stop", "break", "end"], answer: 2, explanation: "break stops loops." },
    { q: "Which data type stores true/false?", options: ["String", "Boolean", "Number", "Object"], answer: 1, explanation: "Boolean stores true/false." },
    { q: "Which tag creates a link?", options: ["<a>", "<link>", "<href>", "<url>"], answer: 0, explanation: "<a> creates links." },

    /* extra */
    { q: "Which keyword declares constant?", options: ["var", "let", "const", "static"], answer: 2, explanation: "const declares constants." },
    { q: "Which method removes last array item?", options: ["pop()", "push()", "shift()", "slice()"], answer: 0, explanation: "pop() removes last item." },
    { q: "Which CSS property sets text color?", options: ["font", "background", "color", "style"], answer: 2, explanation: "color sets text color." },
    { q: "Which JS loop runs at least once?", options: ["for", "while", "do-while", "foreach"], answer: 2, explanation: "do-while runs at least once." },
    { q: "Which HTML attribute is unique?", options: ["class", "id", "name", "type"], answer: 1, explanation: "id must be unique." },
    { q: "Which HTTP method updates data?", options: ["GET", "POST", "PUT", "FETCH"], answer: 2, explanation: "PUT updates data." },
    { q: "Which CSS layout is one-dimensional?", options: ["Grid", "Flexbox", "Table", "Float"], answer: 1, explanation: "Flexbox is one-dimensional." },
    { q: "Which JS object stores key-value pairs?", options: ["Array", "Map", "Object", "Set"], answer: 2, explanation: "Object stores key-value pairs." },
    { q: "Which symbol is used for comments?", options: ["##", "**", "//", "<!-- -->"], answer: 2, explanation: "// is comment symbol." },
    { q: "Which keyword creates class?", options: ["function", "class", "object", "new"], answer: 1, explanation: "class creates classes." }
  ],

  devops: [
    { q: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Deployment", "Cloud Infrastructure", "Code Delivery", "Continuous Design"], answer: 0, explanation: "CI/CD automates build & deploy." },
    { q: "Which AWS service is object storage?", options: ["EC2", "RDS", "S3", "Lambda"], answer: 2, explanation: "S3 stores objects." },
    { q: "Which command lists running containers?", options: ["docker ps", "docker images", "docker run", "docker build"], answer: 0, explanation: "docker ps lists running containers." },
    { q: "Which tool is for orchestration?", options: ["Docker", "Kubernetes", "Jenkins", "Ansible"], answer: 1, explanation: "Kubernetes orchestrates containers." },
    { q: "Which AWS service is serverless?", options: ["EC2", "RDS", "Lambda", "EBS"], answer: 2, explanation: "Lambda is serverless." },
    { q: "Which command initializes Terraform?", options: ["terraform start", "terraform init", "terraform plan", "terraform apply"], answer: 1, explanation: "terraform init initializes." },
    { q: "Which CI tool is popular?", options: ["Git", "Docker", "Jenkins", "Linux"], answer: 2, explanation: "Jenkins is CI tool." },
    { q: "Which AWS service is NoSQL?", options: ["RDS", "DynamoDB", "S3", "Aurora"], answer: 1, explanation: "DynamoDB is NoSQL." },
    { q: "Which port does HTTP use?", options: ["21", "22", "80", "443"], answer: 2, explanation: "HTTP uses port 80." },
    { q: "Which AWS service provides DNS?", options: ["Route 53", "CloudFront", "VPC", "ELB"], answer: 0, explanation: "Route 53 provides DNS." },

    /* extra */
    { q: "Which AWS service stores secrets?", options: ["S3", "Secrets Manager", "IAM", "CloudTrail"], answer: 1, explanation: "Secrets Manager stores secrets." },
    { q: "Which tool manages IaC?", options: ["Docker", "Terraform", "Kubernetes", "Jenkins"], answer: 1, explanation: "Terraform manages IaC." },
    { q: "Which command checks Docker version?", options: ["docker info", "docker -v", "docker ps", "docker run"], answer: 1, explanation: "docker -v shows version." },
    { q: "Which load balancer is Layer 7?", options: ["ALB", "NLB", "ELB", "CLB"], answer: 0, explanation: "ALB works at Layer 7." },
    { q: "Which Linux command shows processes?", options: ["ps", "top", "jobs", "all"], answer: 0, explanation: "ps shows processes." },
    { q: "Which Linux command shows disk usage?", options: ["ls", "df -h", "du", "pwd"], answer: 1, explanation: "df -h shows disk usage." },
    { q: "Which protocol is secure?", options: ["HTTP", "FTP", "HTTPS", "SMTP"], answer: 2, explanation: "HTTPS is secure." },
    { q: "Which AWS service monitors logs?", options: ["CloudTrail", "CloudWatch", "Config", "Inspector"], answer: 1, explanation: "CloudWatch monitors logs." },
    { q: "Which Git command commits changes?", options: ["git push", "git commit", "git add", "git merge"], answer: 1, explanation: "git commit commits changes." },
    { q: "Which Kubernetes unit is smallest?", options: ["Node", "Pod", "Service", "Cluster"], answer: 1, explanation: "Pod is smallest unit." }
  ]
};

/* ---------------- CONFIG ---------------- */

const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
};

/* ---------------- ELEMENTS ---------------- */

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

/* ---------------- STATE ---------------- */

let selectedCategory = "";
let selectedDifficulty = "";
let questions = [];
let index = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answered = false;

/* ---------------- HELPERS ---------------- */

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

/* ---------------- CATEGORY ---------------- */

document.querySelectorAll(".category").forEach(btn => {
  btn.onclick = () => {
    selectedCategory = btn.dataset.type;
    categoryBox.classList.add("hidden");
    difficultyBox.classList.remove("hidden");
  };
});

/* ---------------- DIFFICULTY ---------------- */

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.onclick = () => {
    selectedDifficulty = btn.textContent.toLowerCase();
    startQuiz();
  };
});

/* ---------------- QUIZ ---------------- */

function startQuiz() {
  const config = DIFFICULTY[selectedDifficulty];
  const available = QUESTIONS[selectedCategory].length;
  const count = Math.min(config.count, available);

  questions = shuffle([...QUESTIONS[selectedCategory]]).slice(0, count);
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

/* ---------------- RESULT ---------------- */

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

/* ---------------- RESET ---------------- */

restartBtn.onclick = () => {
  resultBox.classList.add("hidden");
  categoryBox.classList.remove("hidden");
};
