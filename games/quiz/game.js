/* Quiz Game - production ready */

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

// ----------------- questions -----------------
// Keep the QUESTIONS object here. Example structure:
const QUESTIONS = {
  fun: [
    { q: "Which planet is known as the Red Planet?", options: ["Earth","Mars","Jupiter","Venus"], answer: 1, explanation: "Mars looks red due to iron oxide." },
    { q: "How many colors are there in a rainbow?", options: ["5","6","7","8"], answer: 2, explanation: "A rainbow has 7 colors." }
    // add remaining items...
  ],
  technical: [
    { q: "Which language runs in browser?", options: ["Python","C","JavaScript","Java"], answer: 2, explanation: "JavaScript runs in browser." }
    // add remaining items...
  ],
  devops: [
    { q: "CI/CD means?", options: ["A","B","Continuous Integration / Deployment","D"], answer: 2, explanation: "CI/CD automates build & deploy." }
    // add remaining items...
  ]
};

// ----------------- elements -----------------
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
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]] = [arr[j],arr[i]];
  }
  return arr;
}

// category selection
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
  const cfg = DIFFICULTY[difficulty];
  // safe slice: shuffle copy then slice
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
  els.progress.style.width = `${((index+1)/questions.length)*100}%`;
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
