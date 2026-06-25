/* Color Sort Puzzle - production ready */
const COLORS = ["red","blue","green","yellow","purple","cyan"];
const DIFFICULTY = { easy:4, medium:6, hard:8 };

let level = 1;
let difficulty = localStorage.getItem("cs_difficulty") || "easy";
let MAX_HEIGHT = DIFFICULTY[difficulty];
let tubes = [], selected = null, moves = 0, history = [];

const tubesEl = document.getElementById("tubes");
const levelEl = document.getElementById("levelText");
const movesEl = document.getElementById("moves");
const bestEl = document.getElementById("best");
const diffSelect = document.getElementById("difficulty");
const nextBtn = document.getElementById("nextLevel");

const sounds = {
  pour: new Audio("./assets/sounds/pour.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
  win: new Audio("./assets/sounds/win.mp3")
};
Object.values(sounds).forEach(s => s.volume = 0.7);

// unlock audio on first gesture
let audioUnlocked = false;
["click","touchstart"].forEach(evt => {
  document.addEventListener(evt, () => { audioUnlocked = true; }, { once:true });
});
function play(name){
  if(!audioUnlocked) return;
  const s = sounds[name];
  if(!s) return;
  s.currentTime = 0;
  s.play().catch(()=>{});
}

diffSelect.value = difficulty;

/* storage helpers */
function bestKey(){ return `cs_best_${difficulty}_${level}`; }
function saveGame(){ localStorage.setItem("cs_save", JSON.stringify({ level,difficulty,tubes,moves })); }
function loadGame(){
  try{
    const d = JSON.parse(localStorage.getItem("cs_save"));
    if(!d) return false;
    ({ level,difficulty,tubes,moves } = d);
    MAX_HEIGHT = DIFFICULTY[difficulty];
    diffSelect.value = difficulty;
    return true;
  }catch(e){ return false; }
}

/* level generation */
function generate(){
  const count = Math.min(3 + level, COLORS.length);
  const used = COLORS.slice(0,count);
  let pool = [];
  used.forEach(c => { for(let i=0;i<MAX_HEIGHT;i++) pool.push(c); });
  // Fisher-Yates shuffle
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [pool[i],pool[j]] = [pool[j],pool[i]];
  }
  let res = [];
  for(let i=0;i<count;i++) res.push(pool.splice(0,MAX_HEIGHT));
  res.push([]); res.push([]);
  return res;
}

/* render */
function render(){
  tubesEl.innerHTML = "";
  tubes.forEach((tube,i) => {
    const t = document.createElement("div");
    t.className = "tube";
    t.setAttribute("role","listitem");
    t.setAttribute("aria-label", `Tube ${i+1}, ${tube.length} balls`);
    if(i === selected) t.classList.add("selected");
    tube.forEach(c => {
      const b = document.createElement("div");
      b.className = `ball ${c}`;
      b.setAttribute("aria-hidden","true");
      t.appendChild(b);
    });
    // click & touch
    t.addEventListener("click", () => click(i));
    t.addEventListener("touchstart", (e) => { e.preventDefault(); click(i); });
    tubesEl.appendChild(t);
  });
  levelEl.textContent = `Level ${level}`;
  movesEl.textContent = moves;
  bestEl.textContent = localStorage.getItem(bestKey()) || "--";
}

/* game logic */
function click(i){
  if(selected === null){
    if(!tubes[i].length) return;
    selected = i;
  } else {
    if(selected !== i) pour(selected, i);
    selected = null;
  }
  render();
}

function pour(a,b){
  if(!tubes[a].length || tubes[b].length === MAX_HEIGHT){ play("wrong"); return; }
  const c = tubes[a][tubes[a].length - 1];
  const t = tubes[b][tubes[b].length - 1];
  if(!t || t === c){
    history.push(JSON.parse(JSON.stringify({ tubes, moves })));
    tubes[a].pop(); tubes[b].push(c);
    moves++; play("pour");
    saveGame(); checkWin();
  } else {
    play("wrong");
  }
}

/* hint */
document.getElementById("hint").addEventListener("click", () => {
  document.querySelectorAll(".tube").forEach(t => t.classList.remove("hint"));
  for(let i=0;i<tubes.length;i++){
    for(let j=0;j<tubes.length;j++){
      if(i===j) continue;
      if(!tubes[i].length || tubes[j].length===MAX_HEIGHT) continue;
      const topI = tubes[i][tubes[i].length-1];
      const topJ = tubes[j][tubes[j].length-1];
      if(!topJ || topI === topJ){
        tubesEl.children[i].classList.add("hint");
        tubesEl.children[j].classList.add("hint");
        return;
      }
    }
  }
});

/* undo */
document.getElementById("undo").addEventListener("click", () => {
  if(!history.length) return;
  const p = history.pop();
  tubes = p.tubes; moves = p.moves;
  saveGame(); render();
});

/* win */
function checkWin(){
  const win = tubes.every(t => !t.length || (t.length === MAX_HEIGHT && t.every(c => c === t[0])));
  if(win){
    const b = Number(localStorage.getItem(bestKey())) || Infinity;
    if(moves < b) localStorage.setItem(bestKey(), moves);
    play("win");
    document.querySelectorAll(".tube").forEach(t => t.classList.add("win"));
    nextBtn.classList.remove("hidden");
  }
}

/* controls */
nextBtn.addEventListener("click", () => { level++; start(); });
document.getElementById("reset").addEventListener("click", start);
diffSelect.addEventListener("change", () => {
  difficulty = diffSelect.value;
  MAX_HEIGHT = DIFFICULTY[difficulty];
  localStorage.setItem("cs_difficulty", difficulty);
  start();
});

/* init */
function start(){
  history = []; moves = 0; selected = null;
  tubes = generate(); saveGame();
  nextBtn.classList.add("hidden");
  render();
}

if(!loadGame()) start();
render();
