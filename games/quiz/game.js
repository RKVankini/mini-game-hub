// ================= SOUND ENGINE =================
const sounds = {
  click: new Audio("./assets/sounds/click.mp3"),
  correct: new Audio("./assets/sounds/correct.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
  timeout: new Audio("./assets/sounds/timeout.mp3"),
  win: new Audio("./assets/sounds/win.mp3")
};
Object.values(sounds).forEach(s => (s.volume = 0.6));

let audioUnlocked = false;
["click","touchstart"].forEach(evt =>
  document.addEventListener(evt, () => { audioUnlocked = true; }, { once:true })
);
function playSound(name) {
  if (!audioUnlocked || !sounds[name]) return;
  sounds[name].currentTime = 0;
  sounds[name].play().catch(()=>{});
}

// ================= CONFIG =================
const DIFFICULTY = {
  easy: { count: 10, time: 15 },
  medium: { count: 15, time: 10 },
  hard: { count: 20, time: 5 }
};

// ================= QUESTIONS =================
// Keep your QUESTIONS object here (fun, technical, devops categories)

// ================= ENGINE =================
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

let category="", difficulty="", questions=[], index=0, score=0;
let timer=null, timeLeft=0, answered=false, lastTick=0;

// Shuffle helper
function shuffle(arr) {
  for (let i=arr.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

// Category select
document.querySelectorAll(".category").forEach(btn=>{
  btn.onclick=()=>{
    playSound("click");
    category=btn.dataset.type;
    els.categoryBox.classList.add("hidden");
    els.difficultyBox.classList.remove("hidden");
  };
});

// Difficulty select
document.querySelectorAll(".difficulty").forEach(btn=>{
  btn.onclick=()=>{
    playSound("click");
    difficulty=btn.textContent.toLowerCase();
    startQuiz();
  };
});

function startQuiz() {
  const cfg=DIFFICULTY[difficulty];
  questions=shuffle([...QUESTIONS[category]]).slice(0,cfg.count);
  index=0; score=0;
  els.score.textContent=score;
  els.difficultyBox.classList.add("hidden");
  els.quizBox.classList.remove("hidden");
  loadQuestion();
}

function loadQuestion() {
  answered=false;
  els.options.innerHTML="";
  els.explanation.classList.add("hidden");
  els.next.disabled=true;
  const q=questions[index];
  els.question.textContent=q.q;
  q.options.forEach((opt,i)=>{
    const btn=document.createElement("button");
    btn.className="option";
    btn.textContent=opt;
    btn.onclick=()=>selectAnswer(i);
    els.options.appendChild(btn);
  });
  els.progress.style.width=`${((index+1)/questions.length)*100}%`;
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft=DIFFICULTY[difficulty].time;
  els.time.textContent=timeLeft;
  lastTick=performance.now();
  timer=setInterval(()=>{
    const now=performance.now();
    if(now-lastTick>=1000){
      timeLeft--; lastTick=now;
      els.time.textContent=timeLeft;
      if(timeLeft<=0){
        clearInterval(timer);
        playSound("timeout");
        els.next.disabled=false;
      }
    }
  },200);
}

function selectAnswer(sel) {
  if(answered) return;
  answered=true; clearInterval(timer);
  const correct=questions[index].answer;
  document.querySelectorAll(".option").forEach((b,i)=>{
    b.disabled=true;
    if(i===correct) b.classList.add("correct");
    if(i===sel && i!==correct) b.classList.add("wrong");
  });
  if(sel===correct){
    playSound("correct");
    score++; els.score.textContent=score;
  } else {
    playSound("wrong");
  }
  els.explanation.textContent=questions[index].explanation;
  els.explanation.classList.remove("hidden");
  els.next.disabled=false;
}

els.next.onclick=()=>{
  index++;
  index<questions.length ? loadQuestion() : showResult();
};

function showResult() {
  playSound("win");
  els.quizBox.classList.add("hidden");
  els.resultBox.classList.remove("hidden");
  els.finalScore.textContent=`${score} / ${questions.length}`;
  const key=`best_${category}_${difficulty}`;
  const best=Number(localStorage.getItem(key))||0;
  if(score>best) localStorage.setItem(key,score);
  els.bestScore.textContent=`Best Score: ${localStorage.getItem(key)}`;
}

els.restart.onclick=()=>location.reload();
