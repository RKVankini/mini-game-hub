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
const play = n => { sounds[n].currentTime=0; sounds[n].play(); };

diffSelect.value = difficulty;

function saveGame() {
  localStorage.setItem("cs_save", JSON.stringify({ level,difficulty,tubes,moves }));
}
function loadGame() {
  const d = JSON.parse(localStorage.getItem("cs_save"));
  if (!d) return false;
  ({ level,difficulty,tubes,moves } = d);
  MAX_HEIGHT = DIFFICULTY[difficulty];
  diffSelect.value = difficulty;
  return true;
}

function generate() {
  const count = Math.min(3 + level, COLORS.length);
  const used = COLORS.slice(0,count);
  let pool = [];
  used.forEach(c => { for(let i=0;i<MAX_HEIGHT;i++) pool.push(c); });
  pool.sort(()=>Math.random()-0.5);
  let res=[];
  for(let i=0;i<count;i++) res.push(pool.splice(0,MAX_HEIGHT));
  res.push([]); res.push([]);
  return res;
}

function render() {
  tubesEl.innerHTML="";
  tubes.forEach((tube,i)=>{
    const t=document.createElement("div");
    t.className="tube";
    if(i===selected) t.classList.add("selected");
    tube.forEach(c=>{
      const b=document.createElement("div");
      b.className=`ball ${c}`;
      t.appendChild(b);
    });
    t.onclick=()=>click(i);
    t.ontouchstart=()=>click(i);
    tubesEl.appendChild(t);
  });
  levelEl.textContent=`Level ${level}`;
  movesEl.textContent=moves;
  bestEl.textContent=localStorage.getItem(bestKey())||"--";
}

function click(i){
  if(selected===null){
    if(!tubes[i].length) return;
    selected=i;
  } else {
    if(selected!==i) pour(selected,i);
    selected=null;
  }
  render();
}

function pour(a,b){
  if(!tubes[a].length||tubes[b].length===MAX_HEIGHT){ play("wrong"); return; }
  const c=tubes[a][tubes[a].length-1];
  const t=tubes[b][tubes[b].length-1];
  if(!t||t===c){
    history.push(JSON.parse(JSON.stringify({tubes,moves})));
    tubes[a].pop(); tubes[b].push(c);
    moves++; play("pour");
    saveGame(); checkWin();
  } else play("wrong");
}

document.getElementById("hint").onclick=()=>{
  document.querySelectorAll(".tube").forEach(t=>t.classList.remove("hint"));
  for(let i=0;i<tubes.length;i++){
    for(let j=0;j<tubes.length;j++){
      if(i===j)continue;
      if(!tubes[i].length||tubes[j].length===MAX_HEIGHT)continue;
      if(!tubes[j].length||tubes[i][tubes[i].length-1]===tubes[j][tubes[j].length-1]){
        tubesEl.children[i].classList.add("hint");
        tubesEl.children[j].classList.add("hint");
        return;
      }
    }
  }
};

document.getElementById("undo").onclick=()=>{
  if(!history.length)return;
  const p=history.pop();
  tubes=p.tubes; moves=p.moves;
  saveGame(); render();
};

function checkWin(){
  const win=tubes.every(t=>!t.length||(t.length===MAX_HEIGHT&&t.every(c=>c===t[0])));
  if(win){
    saveBest(); play("win");
    document.querySelectorAll(".tube").forEach(t=>t.classList.add("win"));
    nextBtn.classList.remove("hidden");
  }
}

function bestKey(){ return `cs_best_${difficulty}_${level}`; }
function saveBest(){
  const b=localStorage.getItem(bestKey());
  if(!b||moves<b) localStorage.setItem(bestKey(),moves);
}

nextBtn.onclick=()=>{ level++; start(); };
document.getElementById("reset").onclick=start;
diffSelect.onchange=()=>{
  difficulty=diffSelect.value;
  MAX_HEIGHT=DIFFICULTY[difficulty];
  localStorage.setItem("cs_difficulty",difficulty);
  start();
};

function start(){
  history=[]; moves=0; selected=null;
  tubes=generate(); saveGame();
  nextBtn.classList.add("hidden");
  render();
}

if(!loadGame()) start();
render();
