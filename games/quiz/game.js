/* Quiz Game - full production-ready game.js
   - Categories: fun, technical, devops, dadjokes, mulesoft
   - Robust category handling, safe slicing, expanded question banks
   - Accurate timer using performance.now()
   - Audio unlock for mobile (click/touch)
   - Keyboard and touch accessibility
   - LocalStorage best score keys: best_<category>_<difficulty>
*/

/* ================= SOUNDS ================= */
const sounds = {
  click: new Audio("./assets/sounds/click.mp3"),
  correct: new Audio("./assets/sounds/correct.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
  timeout: new Audio("./assets/sounds/timeout.mp3"),
  win: new Audio("./assets/sounds/win.mp3")
};
Object.values(sounds).forEach(s => { s.volume = 0.6; s.preload = "auto"; });

let audioUnlocked = false;
["click", "touchstart"].forEach(evt =>
  document.addEventListener(evt, () => { audioUnlocked = true; }, { once: true })
);
function playSound(name) {
  if (!audioUnlocked) return;
  const s = sounds[name];
  if (!s) return;
  try { s.currentTime = 0; s.play().catch(()=>{}); } catch(e) {}
}

/* ================= CONFIG ================= */
const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
};

/* ================= QUESTIONS =================
   Each entry: { q: "question", options: [...], answer: <index>, explanation: "..." }
*/
const QUESTIONS = {
  fun: [
    { q: "Which planet is known as the Red Planet?", options: ["Earth","Mars","Jupiter","Venus"], answer: 1, explanation: "Mars looks red due to iron oxide on its surface." },
    { q: "How many colors are there in a rainbow?", options: ["5","6","7","8"], answer: 2, explanation: "A rainbow has 7 distinct colors." },
    { q: "Ship of the desert is", options: ["Horse","Camel","Donkey","Elephant"], answer: 1, explanation: "Camel is commonly called the ship of the desert." },
    { q: "King of fruits in India", options: ["Apple","Banana","Mango","Orange"], answer: 2, explanation: "Mango is often called the king of fruits in India." },
    { q: "How many days in a leap year?", options: ["365","366","364","360"], answer: 1, explanation: "A leap year has 366 days." },
    { q: "Largest ocean on Earth", options: ["Atlantic","Indian","Pacific","Arctic"], answer: 2, explanation: "The Pacific Ocean is the largest." },
    { q: "National bird of India", options: ["Sparrow","Peacock","Crow","Eagle"], answer: 1, explanation: "Peacock is the national bird of India." },
    { q: "How many continents are there?", options: ["5","6","7","8"], answer: 2, explanation: "There are 7 continents." },
    { q: "Which month has 28 days?", options: ["February","All months","January","March"], answer: 1, explanation: "All months have at least 28 days." },
    { q: "Tallest land animal", options: ["Elephant","Horse","Camel","Giraffe"], answer: 3, explanation: "Giraffe is the tallest land animal." },
    { q: "What gas do plants absorb?", options: ["Oxygen","Nitrogen","Carbon Dioxide","Hydrogen"], answer: 2, explanation: "Plants absorb carbon dioxide for photosynthesis." },
    { q: "Which instrument has keys, pedals and strings?", options: ["Guitar","Violin","Piano","Flute"], answer: 2, explanation: "A piano has keys, strings and pedals." },
    { q: "What is H2O commonly known as?", options: ["Salt","Water","Hydrogen","Oxygen"], answer: 1, explanation: "H2O is the chemical formula for water." },
    { q: "Which animal is known for its black and white stripes?", options: ["Tiger","Zebra","Leopard","Hyena"], answer: 1, explanation: "Zebra has distinctive black and white stripes." },
    { q: "Which fruit keeps the doctor away if eaten daily?", options: ["Apple","Banana","Grapes","Orange"], answer: 0, explanation: "An apple a day keeps the doctor away (saying)." },
    { q: "Which metal is liquid at room temperature?", options: ["Mercury","Iron","Gold","Aluminum"], answer: 0, explanation: "Mercury is liquid at room temperature." },
    { q: "Which animal is known as man's best friend?", options: ["Cat","Dog","Parrot","Rabbit"], answer: 1, explanation: "Dog is commonly called man's best friend." },
    { q: "Which is the smallest prime number?", options: ["0","1","2","3"], answer: 2, explanation: "2 is the smallest and only even prime number." },
    { q: "Which day comes after Friday?", options: ["Saturday","Sunday","Thursday","Monday"], answer: 0, explanation: "Saturday follows Friday." },
    { q: "Which color do you get by mixing red and blue?", options: ["Green","Purple","Orange","Brown"], answer: 1, explanation: "Red and blue mix to make purple." }
  ],

  technical: [
    { q: "Which language runs in the browser?", options: ["Python","C","JavaScript","Java"], answer: 2, explanation: "JavaScript runs natively in browsers." },
    { q: "What does CSS stand for?", options: ["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Colorful Style Sheets"], answer: 1, explanation: "CSS stands for Cascading Style Sheets." },
    { q: "Which keyword declares a block-scoped variable in JS?", options: ["var","let","const","define"], answer: 1, explanation: "`let` declares a block-scoped variable." },
    { q: "How do you parse JSON in JavaScript?", options: ["JSON.parse()","parseJSON()","toJSON()","JSON.toObject()"], answer: 0, explanation: "Use JSON.parse() to convert JSON string to object." },
    { q: "Which operator checks value and type equality in JS?", options: ["=","==","===","!=="], answer: 2, explanation: "`===` checks both value and type." },
    { q: "Which array method adds an item to the end?", options: ["pop","push","shift","slice"], answer: 1, explanation: "push() adds items to the end of an array." },
    { q: "Which statement exits a loop immediately?", options: ["exit","break","stop","continue"], answer: 1, explanation: "break exits the loop." },
    { q: "Which data type stores true/false?", options: ["Text","Boolean","Number","Object"], answer: 1, explanation: "Boolean stores true or false." },
    { q: "Which HTML tag creates a hyperlink?", options: ["<link>","<a>","<href>","<url>"], answer: 1, explanation: "<a> tag creates hyperlinks." },
    { q: "How do you write a single-line comment in JS?", options: ["## comment","// comment","<!-- comment -->","/* comment */"], answer: 1, explanation: "// is used for single-line comments in JS." },
    { q: "Which method converts a JS object to JSON string?", options: ["JSON.stringify()","toJSON()","JSON.parse()","stringify()"], answer: 0, explanation: "JSON.stringify() converts an object to JSON string." },
    { q: "Which CSS property controls layout direction in flexbox?", options: ["display","flex-direction","position","float"], answer: 1, explanation: "flex-direction controls the direction of flex items." },
    { q: "Which HTTP status code means Not Found?", options: ["200","301","404","500"], answer: 2, explanation: "404 indicates resource not found." },
    { q: "Which tool is used for version control?", options: ["Docker","Git","Jenkins","Kubernetes"], answer: 1, explanation: "Git is a version control system." },
    { q: "Which protocol is used to load web pages securely?", options: ["HTTP","FTP","SMTP","HTTPS"], answer: 3, explanation: "HTTPS is HTTP over TLS/SSL for secure communication." },
    { q: "Which HTML attribute sets alternative text for images?", options: ["title","alt","src","role"], answer: 1, explanation: "The alt attribute provides alternative text for images." },
    { q: "Which JS method schedules a function after a delay?", options: ["setInterval","setTimeout","requestAnimationFrame","delay"], answer: 1, explanation: "setTimeout schedules a one-time delayed call." },
    { q: "Which storage is synchronous in browsers?", options: ["localStorage","sessionStorage","IndexedDB","Cookies"], answer: 0, explanation: "localStorage is synchronous." },
    { q: "Which tag loads an external JS file?", options: ["<script>","<link>","<import>","<js>"], answer: 0, explanation: "<script src='...'></script> loads JS." },
    { q: "Which CSS unit is relative to viewport width?", options: ["em","rem","vw","px"], answer: 2, explanation: "vw is viewport width unit." }
  ],

  devops: [
    { q: "What does CI/CD stand for?", options: ["Continuous Integration / Continuous Delivery","Continuous Integration / Continuous Deployment","Continuous Improvement / Continuous Delivery","Continuous Integration / Continuous Development"], answer: 1, explanation: "CI/CD commonly refers to Continuous Integration and Continuous Deployment." },
    { q: "Which AWS service is object storage?", options: ["EC2","RDS","S3","Lambda"], answer: 2, explanation: "Amazon S3 is object storage." },
    { q: "Which command lists running Docker containers?", options: ["docker ps","docker run","docker build","docker images"], answer: 0, explanation: "docker ps lists running containers." },
    { q: "Which AWS service is serverless compute?", options: ["EC2","RDS","Lambda","EBS"], answer: 2, explanation: "AWS Lambda is serverless compute." },
    { q: "Which tool is primarily used for Infrastructure as Code?", options: ["Docker","Terraform","Git","Linux"], answer: 1, explanation: "Terraform is an IaC tool." },
    { q: "Which port is default for HTTP?", options: ["21","22","80","443"], answer: 2, explanation: "HTTP uses port 80 by default." },
    { q: "Which AWS service provides DNS?", options: ["Route53","S3","VPC","ELB"], answer: 0, explanation: "Route 53 is AWS DNS service." },
    { q: "In Kubernetes what is the smallest deployable unit?", options: ["Node","Pod","Service","Cluster"], answer: 1, explanation: "Pod is the smallest deployable unit in Kubernetes." },
    { q: "Which service is used to store secrets in AWS?", options: ["S3","IAM","Secrets Manager","CloudTrail"], answer: 2, explanation: "AWS Secrets Manager stores secrets securely." },
    { q: "Which tool is commonly used for CI automation?", options: ["Git","Jenkins","Linux","Docker"], answer: 1, explanation: "Jenkins is a popular CI automation server." },
    { q: "What does 'immutable infrastructure' mean?", options: ["Servers are patched in place","Servers are replaced rather than modified","Servers are never updated","Servers are only virtual"], answer: 1, explanation: "Immutable infra means replace rather than modify servers." },
    { q: "What is blue-green deployment?", options: ["Two identical environments for safe switching","A database migration strategy","A monitoring technique","A security model"], answer: 0, explanation: "Blue-green uses two environments to switch traffic safely." },
    { q: "Which tool is used for container orchestration?", options: ["Docker","Kubernetes","Ansible","Terraform"], answer: 1, explanation: "Kubernetes orchestrates containers at scale." },
    { q: "What does 'IaC' stand for?", options: ["Infrastructure as Code","Integration as Code","Instance as Code","Image as Code"], answer: 0, explanation: "IaC stands for Infrastructure as Code." },
    { q: "Which protocol is used for secure shell access?", options: ["FTP","SSH","HTTP","SMTP"], answer: 1, explanation: "SSH is used for secure shell access." }
  ],

  dadjokes: [
    { q: "Why did the scarecrow win an award?", options: ["He was outstanding in his field","He scared the crows","He told jokes","He planted crops"], answer: 0, explanation: "He was outstanding in his field — classic dad joke." },
    { q: "I told my wife she was drawing her eyebrows too high. She looked", options: ["Surprised","Angry","Happy","Confused"], answer: 0, explanation: "Surprised — a cheeky one-liner." },
    { q: "What do you call fake spaghetti?", options: ["An impasta","A noodle","A fraud","A clone"], answer: 0, explanation: "An impasta — punny dad humor." },
    { q: "Why don't skeletons fight each other?", options: ["They don't have guts","They are friends","They are lazy","They are busy"], answer: 0, explanation: "They don't have guts — light spooky dad joke." },
    { q: "I would tell you a construction joke but", options: ["I'm still working on it","It's finished","It's too heavy","It's dangerous"], answer: 0, explanation: "Still working on it — classic delivery." },
    { q: "Why did the coffee file a police report?", options: ["It got mugged","It was spilled","It was cold","It was stolen"], answer: 0, explanation: "It got mugged — coffee pun." },
    { q: "What do you call cheese that isn't yours?", options: ["Nacho cheese","Blue cheese","Swiss","Cheddar"], answer: 0, explanation: "Nacho cheese — staple dad joke." },
    { q: "I asked the librarian if the library had books on paranoia. She whispered", options: ["They're right behind you","No books","Yes, upstairs","Try online"], answer: 0, explanation: "They're right behind you — playful and safe." },
    { q: "Why did the tomato blush?", options: ["Because it saw the salad dressing","Because it was ripe","Because it was hot","Because it was late"], answer: 0, explanation: "Saw the salad dressing — harmless cheeky humor." },
    { q: "What do you call a belt made of watches?", options: ["A waist of time","A fashion statement","A clockbelt","A timer"], answer: 0, explanation: "A waist of time — punny and light." },
    { q: "Why did the bicycle fall over?", options: ["It was two-tired","It was old","It was broken","It was stolen"], answer: 0, explanation: "It was two-tired — dad pun." },
    { q: "Why don't eggs tell jokes?", options: ["They'd crack up","They are shy","They are raw","They are busy"], answer: 0, explanation: "They'd crack up — egg pun." },
    { q: "What do you call a factory that makes okay products?", options: ["A satisfactory","A great factory","An average plant","A mediocre mill"], answer: 0, explanation: "A satisfactory — wordplay." },
    { q: "Why did the math book look sad?", options: ["It had too many problems","It was old","It was lost","It was torn"], answer: 0, explanation: "It had too many problems — classic." },
    { q: "Why did the golfer bring two pairs of pants?", options: ["In case he got a hole in one","For style","For comfort","For weather"], answer: 0, explanation: "In case he got a hole in one — pun." }
  ],

  mulesoft: [
    { q: "What is MuleSoft primarily used for?", options: ["Database management","API-led connectivity and integration","Frontend development","Cloud hosting"], answer: 1, explanation: "MuleSoft is an integration platform for APIs and connectivity." },
    { q: "Which runtime does MuleSoft use for executing integrations?", options: ["Node.js","Mule runtime","Java EE","Python runtime"], answer: 1, explanation: "Mule runtime executes Mule applications." },
    { q: "What is Anypoint Platform?", options: ["A CI tool","MuleSoft's integration platform","A database","A monitoring tool"], answer: 1, explanation: "Anypoint Platform is MuleSoft's integration and API platform." },
    { q: "Which protocol is commonly used with MuleSoft for APIs?", options: ["SMTP","FTP","HTTP/HTTPS","SSH"], answer: 2, explanation: "HTTP/HTTPS is commonly used for APIs." },
    { q: "What is an API-led approach?", options: ["Building monolithic apps","Designing reusable APIs for different layers","Only using SOAP APIs","Avoiding APIs"], answer: 1, explanation: "API-led approach designs reusable APIs for system, process and experience layers." },
    { q: "Which tool is used to design APIs in MuleSoft?", options: ["Anypoint Studio","Anypoint Design Center","Anypoint Exchange","Anypoint Runtime Manager"], answer: 1, explanation: "Anypoint Design Center is used to design APIs (RAML/OAS)." },
    { q: "What is Anypoint Studio?", options: ["A cloud service","A desktop IDE for building Mule apps","A database","A testing framework"], answer: 1, explanation: "Anypoint Studio is the desktop IDE for building Mule applications." },
    { q: "Which format is commonly used to describe APIs in MuleSoft Design Center?", options: ["RAML","XML only","CSV","YAML only"], answer: 0, explanation: "RAML (and OpenAPI) are commonly used to describe APIs." },
    { q: "What is Anypoint Exchange used for?", options: ["Running apps","Storing and sharing APIs and connectors","Monitoring servers","Managing users"], answer: 1, explanation: "Exchange is a marketplace for APIs, templates and connectors." },
    { q: "Which connector would you use to connect to Salesforce from Mule?", options: ["Database connector","Salesforce connector","FTP connector","SMTP connector"], answer: 1, explanation: "Use the Salesforce connector to integrate with Salesforce." },
    { q: "Which language is commonly used to extend Mule applications?", options: ["Java","Ruby","Go","Rust"], answer: 0, explanation: "Java is commonly used to extend Mule apps." },
    { q: "What is a Mule flow?", options: ["A database schema","A sequence of message processors","A UI component","A deployment artifact"], answer: 1, explanation: "A Mule flow is a sequence of processors that handle messages." },
    { q: "What is the purpose of a connector in MuleSoft?", options: ["To style UI","To connect to external systems","To store logs","To manage users"], answer: 1, explanation: "Connectors integrate external systems with Mule apps." },
    { q: "Which component manages deployed Mule apps in cloud?", options: ["Anypoint Runtime Manager","Anypoint Studio","Anypoint Exchange","Anypoint Design Center"], answer: 0, explanation: "Runtime Manager manages deployed apps." },
    { q: "Which spec formats are supported for API design in MuleSoft?", options: ["RAML and OpenAPI","Only RAML","Only WSDL","Only SOAP"], answer: 0, explanation: "MuleSoft supports RAML and OpenAPI (Swagger)." }
  ]
};

/* ================= UI ELEMENTS ================= */
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

/* Defensive checks for missing elements */
Object.keys(els).forEach(k => {
  if (!els[k]) {
    console.warn(`Quiz UI element missing: ${k}`);
  }
});

/* ================= STATE ================= */
let category = "";
let difficulty = "easy";
let questions = [];
let index = 0;
let score = 0;
let timer = null;
let timeLeft = 0;
let answered = false;
let lastTick = 0;

/* ================= HELPERS ================= */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* Normalize category string (trim, lowercase, remove extra spaces) */
function normalizeCategory(s) {
  return (s || "").toString().trim().toLowerCase().replace(/\s+/g, "");
}

/* ================= CATEGORY & DIFFICULTY HANDLERS ================= */
document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    playSound("click");
    const dt = btn.dataset.type || "";
    category = normalizeCategory(dt);
    if (!category) {
      console.error("Category button missing data-type:", btn);
      alert("This category is not available.");
      return;
    }
    if (els.categoryBox) els.categoryBox.classList.add("hidden");
    if (els.difficultyBox) {
      els.difficultyBox.classList.remove("hidden");
      els.difficultyBox.setAttribute("aria-hidden", "false");
    }
  });
});

document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    playSound("click");
    difficulty = (btn.textContent || "easy").toString().trim().toLowerCase();
    startQuiz();
  });
});

/* ================= START QUIZ (robust) ================= */
function startQuiz() {
  // Validate category exists
  if (!category || !QUESTIONS.hasOwnProperty(category)) {
    console.error("startQuiz: invalid category:", category);
    alert("Selected category is not available. Please choose another category.");
    if (els.difficultyBox) els.difficultyBox.classList.add("hidden");
    if (els.categoryBox) els.categoryBox.classList.remove("hidden");
    return;
  }

  const cfg = DIFFICULTY[difficulty] || DIFFICULTY.easy;
  const available = QUESTIONS[category].length;
  const useCount = Math.min(cfg.count, available);

  if (available < cfg.count) {
    // Non-blocking notice (console + optional UI)
    console.info(`Category "${category}" has only ${available} questions; using ${useCount}.`);
    // If you want a UI notice, you can set a small message element; for now we log it.
  }

  // Shuffle a copy and slice safely
  questions = shuffle([...QUESTIONS[category]]).slice(0, useCount);

  if (!questions || questions.length === 0) {
    console.error("No questions available for category:", category);
    alert("No questions available for this category. Please choose another.");
    if (els.difficultyBox) els.difficultyBox.classList.add("hidden");
    if (els.categoryBox) els.categoryBox.classList.remove("hidden");
    return;
  }

  index = 0;
  score = 0;
  if (els.score) els.score.textContent = score;
  if (els.difficultyBox) els.difficultyBox.classList.add("hidden");
  if (els.quizBox) els.quizBox.classList.remove("hidden");
  loadQuestion();
}

/* ================= LOAD QUESTION ================= */
function loadQuestion() {
  answered = false;
  if (els.options) els.options.innerHTML = "";
  if (els.explanation) els.explanation.classList.add("hidden");
  if (els.next) els.next.disabled = true;

  const q = questions[index];
  if (!q) {
    console.error("loadQuestion: missing question at index", index, "questions:", questions);
    showResult();
    return;
  }

  if (els.question) els.question.textContent = q.q;

  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.type = "button";
    b.textContent = opt;
    b.addEventListener("click", () => selectAnswer(i));
    b.addEventListener("touchstart", () => selectAnswer(i));
    // keyboard accessibility
    b.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); }
    });
    if (els.options) els.options.appendChild(b);
  });

  if (els.progress) {
    const pct = ((index + 1) / questions.length) * 100;
    els.progress.style.width = `${pct}%`;
    els.progress.setAttribute("aria-valuenow", Math.round(pct));
  }

  startTimer();
}

/* ================= TIMER ================= */
function startTimer() {
  clearInterval(timer);
  const cfg = DIFFICULTY[difficulty] || DIFFICULTY.easy;
  timeLeft = cfg.time;
  if (els.time) els.time.textContent = timeLeft;
  lastTick = performance.now();
  timer = setInterval(() => {
    const now = performance.now();
    if (now - lastTick >= 1000) {
      timeLeft--;
      lastTick = now;
      if (els.time) els.time.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timer);
        playSound("timeout");
        if (els.next) els.next.disabled = false;
      }
    }
  }, 200);
}

/* ================= SELECT ANSWER ================= */
function selectAnswer(sel) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  const correct = questions[index].answer;
  const optionButtons = Array.from(document.querySelectorAll(".option"));
  optionButtons.forEach((b, i) => {
    b.disabled = true;
    if (i === correct) b.classList.add("correct");
    if (i === sel && i !== correct) b.classList.add("wrong");
  });

  if (sel === correct) {
    playSound("correct");
    score++;
    if (els.score) els.score.textContent = score;
  } else {
    playSound("wrong");
  }

  if (els.explanation) {
    els.explanation.textContent = questions[index].explanation || "";
    els.explanation.classList.remove("hidden");
  }

  if (els.next) els.next.disabled = false;
}

/* ================= NEXT & RESULT ================= */
if (els.next) {
  els.next.addEventListener("click", () => {
    index++;
    if (index < questions.length) loadQuestion();
    else showResult();
  });
}

function showResult() {
  playSound("win");
  if (els.quizBox) els.quizBox.classList.add("hidden");
  if (els.resultBox) els.resultBox.classList.remove("hidden");
  if (els.finalScore) els.finalScore.textContent = `${score} / ${questions.length}`;
  const key = `best_${category}_${difficulty}`;
  const best = Number(localStorage.getItem(key)) || 0;
  if (score > best) localStorage.setItem(key, score);
  if (els.bestScore) els.bestScore.textContent = `Best Score: ${localStorage.getItem(key)}`;
}

/* ================= RESTART ================= */
if (els.restart) {
  els.restart.addEventListener("click", () => {
    // simple reload to reset state and UI
    location.reload();
  });
}

/* ================= KEYBOARD ACCESSIBILITY ================= */
document.addEventListener("keydown", (e) => {
  // "/" focuses search if present (hub-level), but here we ensure Enter triggers focused option
  if ((e.key === "Enter" || e.key === " ") && document.activeElement && document.activeElement.classList.contains("option")) {
    e.preventDefault();
    document.activeElement.click();
  }
});

/* ================= DEBUG HELPERS (optional) ================= */
function debugState() {
  console.log({
    category,
    difficulty,
    questionsAvailable: QUESTIONS[category] ? QUESTIONS[category].length : 0,
    questionsSelected: questions.length,
    index,
    score
  });
}

/* Expose debugState for console use */
window.quizDebug = debugState;

/* ================= INITIALIZATION NOTES =================
 - Ensure your index.html contains category buttons with data-type values matching the QUESTIONS keys:
   e.g. <button class="category" data-type="fun">Fun</button>
         <button class="category" data-type="technical">Technical</button>
         <button class="category" data-type="devops">DevOps</button>
         <button class="category" data-type="dadjokes">Dad Jokes</button>
         <button class="category" data-type="mulesoft">MuleSoft</button>

 - Ensure difficulty buttons exist with class "difficulty" and text "Easy", "Medium", "Hard".
 - If you want every difficulty to always have N questions, expand the QUESTIONS arrays to at least DIFFICULTY.hard.count items.
 - Use the console helper `quizDebug()` to inspect runtime state while testing.
*/
