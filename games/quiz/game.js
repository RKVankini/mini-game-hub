/* Quiz Game - production ready with expanded QUESTIONS and new categories
   - Categories: fun, technical, devops, dadjokes, mulesoft
   - Timer uses performance.now()
   - Audio unlock works on mobile (click or touch)
   - LocalStorage keys: best_<category>_<difficulty>
*/

// ----------------- sounds -----------------
const sounds = {
  click: new Audio("./assets/sounds/click.mp3"),
  correct: new Audio("./assets/sounds/correct.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
  timeout: new Audio("./assets/sounds/timeout.mp3"),
  win: new Audio("./assets/sounds/win.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.6);

// unlock audio on first user gesture (click or touch)
let audioUnlocked = false;
["click","touchstart"].forEach(evt => {
  document.addEventListener(evt, () => { audioUnlocked = true; }, { once:true });
});
function playSound(name){
  if(!audioUnlocked) return;
  const s = sounds[name];
  if(!s) return;
  s.currentTime = 0;
  s.play().catch(()=>{});
}

// ----------------- config -----------------
const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
};

// ----------------- QUESTIONS -----------------
// Each question object: { q: "question", options: [...], answer: <zero-based index>, explanation: "..." }
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
    { q: "Which fruit keeps the doctor away if eaten daily?", options: ["Apple","Banana","Grapes","Orange"], answer: 0, explanation: "An apple a day keeps the doctor away (saying)." }
  ],

  technical: [
    { q: "Which language runs in the browser?", options: ["Python","C","JavaScript","Java"], answer: 2, explanation: "JavaScript is the language that runs natively in browsers." },
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
    { q: "Which CSS property controls layout direction?", options: ["display","flex-direction","position","float"], answer: 1, explanation: "flex-direction controls the direction of flex items." },
    { q: "Which HTTP status code means Not Found?", options: ["200","301","404","500"], answer: 2, explanation: "404 indicates resource not found." },
    { q: "Which tool is used for version control?", options: ["Docker","Git","Jenkins","Kubernetes"], answer: 1, explanation: "Git is a version control system." },
    { q: "Which protocol is used to load web pages securely?", options: ["HTTP","FTP","SMTP","HTTPS"], answer: 3, explanation: "HTTPS is HTTP over TLS/SSL for secure communication." }
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
    { q: "What is blue-green deployment?", options: ["Two identical environments for safe switching","A database migration strategy","A monitoring technique","A security model"], answer: 0, explanation: "Blue-green uses two environments to switch traffic safely." }
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
    { q: "What do you call a belt made of watches?", options: ["A waist of time","A fashion statement","A clockbelt","A timer"], answer: 0, explanation: "A waist of time — punny and light." }
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
    { q: "Which connector would you use to connect to Salesforce from Mule?", options: ["Database connector","Salesforce connector","FTP connector","SMTP connector"], answer: 1, explanation: "Use the Salesforce connector to integrate with Salesforce." }
  ]
};

// ----------------- engine and UI -----------------
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

let category = "", difficulty = "", questions = [], index = 0, score = 0;
let timer = null, timeLeft = 0, answered = false, lastTick = 0;

// shuffle helper (Fisher-Yates)
function shuffle(arr){
  for(let i = arr.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// category selection - ensure your index.html has buttons with data-type matching these keys
document.querySelectorAll(".category").forEach(btn => {
  btn.addEventListener("click", () => {
    playSound("click");
    category = btn.dataset.type;
    els.categoryBox.classList.add("hidden");
    els.difficultyBox.classList.remove("hidden");
    els.difficultyBox.setAttribute("aria-hidden","false");
  });
});

// difficulty selection
document.querySelectorAll(".difficulty").forEach(btn => {
  btn.addEventListener("click", () => {
    playSound("click");
    difficulty = btn.textContent.toLowerCase();
    startQuiz();
  });
});

function startQuiz(){
  if(!QUESTIONS[category] || QUESTIONS[category].length === 0){
    alert("No questions available for this category.");
    return;
  }
  const cfg = DIFFICULTY[difficulty];
  // shuffle a copy and slice safely
  questions = shuffle([...QUESTIONS[category]]).slice(0, Math.min(cfg.count, QUESTIONS[category].length));
  index = 0; score = 0;
  els.score.textContent = score;
  els.difficultyBox.classList.add("hidden");
  els.quizBox.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion(){
  answered = false;
  els.options.innerHTML = "";
  els.explanation.classList.add("hidden");
  els.next.disabled = true;
  const q = questions[index];
  els.question.textContent = q.q;
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "option";
    b.textContent = opt;
    b.addEventListener("click", () => selectAnswer(i));
    b.addEventListener("touchstart", () => selectAnswer(i));
    els.options.appendChild(b);
  });
  els.progress.style.width = `${((index + 1) / questions.length) * 100}%`;
  startTimer();
}

function startTimer(){
  clearInterval(timer);
  timeLeft = DIFFICULTY[difficulty].time;
  els.time.textContent = timeLeft;
  lastTick = performance.now();
  timer = setInterval(() => {
    const now = performance.now();
    if(now - lastTick >= 1000){
      timeLeft--; lastTick = now;
      els.time.textContent = timeLeft;
      if(timeLeft <= 0){
        clearInterval(timer);
        playSound("timeout");
        els.next.disabled = false;
      }
    }
  }, 200);
}

function selectAnswer(sel){
  if(answered) return;
  answered = true;
  clearInterval(timer);
  const correct = questions[index].answer;
  const optionButtons = Array.from(document.querySelectorAll(".option"));
  optionButtons.forEach((b, i) => {
    b.disabled = true;
    if(i === correct) b.classList.add("correct");
    if(i === sel && i !== correct) b.classList.add("wrong");
  });
  if(sel === correct){
    playSound("correct");
    score++; els.score.textContent = score;
  } else {
    playSound("wrong");
  }
  els.explanation.textContent = questions[index].explanation || "";
  els.explanation.classList.remove("hidden");
  els.next.disabled = false;
}

els.next.addEventListener("click", () => {
  index++;
  if(index < questions.length) loadQuestion();
  else showResult();
});

function showResult(){
  playSound("win");
  els.quizBox.classList.add("hidden");
  els.resultBox.classList.remove("hidden");
  els.finalScore.textContent = `${score} / ${questions.length}`;
  const key = `best_${category}_${difficulty}`;
  const best = Number(localStorage.getItem(key)) || 0;
  if(score > best) localStorage.setItem(key, score);
  els.bestScore.textContent = `Best Score: ${localStorage.getItem(key)}`;
}

els.restart.addEventListener("click", () => location.reload());

// keyboard accessibility: Enter on focused option triggers click
document.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && document.activeElement && document.activeElement.classList.contains("option")){
    document.activeElement.click();
  }
});
