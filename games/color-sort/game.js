/* Color Sort Puzzle - upgraded animations & UX
   - Smooth pour animation using a visual "flying" element
   - Drop animation for balls with slight overshoot
   - Confetti on win (canvas)
   - Accessibility: ARIA, keyboard, reduced-motion support
   - Mobile: touchstart handlers, tap feedback
*/

/* ----------------- Config & State ----------------- */
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
const confettiCanvas = document.getElementById("confettiCanvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ----------------- Sounds & Unlock ----------------- */
const sounds = {
  pour: new Audio("./assets/sounds/pour.mp3"),
  wrong: new Audio("./assets/sounds/wrong.mp3"),
  win: new Audio("./assets/sounds/win.mp3")
};
Object.values(sounds).forEach(s => { s.volume = 0.75; s.preload = "auto"; });

let audioUnlocked = false;
["click","touchstart"].forEach(evt => {
  document.addEventListener(evt, () => { audioUnlocked = true; }, { once:true });
});
function play(name){
  if(!audioUnlocked) return;
  const s = sounds[name];
  if(!s) return;
  try { s.currentTime = 0; s.play().catch(()=>{}); } catch(e){}
}

/* ----------------- Storage ----------------- */
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

/* ----------------- Level generation ----------------- */
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

/* ----------------- Render ----------------- */
function render(){
  tubesEl.innerHTML = "";
  tubes.forEach((tube,i) => {
    const t = document.createElement("div");
    t.className = "tube";
    t.setAttribute("role","listitem");
    t.setAttribute("aria-label", `Tube ${i+1}, ${tube.length} balls`);
    if(i === selected) t.classList.add("selected");
    // create ball elements (reverse order visually)
    tube.forEach((c, idx) => {
      const b = document.createElement("div");
      b.className = `ball ${c}`;
      // stagger drop animation for newly rendered stacks
      if(!prefersReducedMotion) {
        b.style.animationDelay = `${idx * 28}ms`;
        b.classList.add("drop");
      }
      t.appendChild(b);
    });

    // interactions
    t.addEventListener("click", () => click(i));
    t.addEventListener("touchstart", (e) => { e.preventDefault(); click(i); });

    // keyboard support
    t.setAttribute("tabindex","0");
    t.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " ") { e.preventDefault(); click(i); }
    });

    tubesEl.appendChild(t);
  });

  levelEl.textContent = `Level ${level}`;
  movesEl.textContent = moves;
  bestEl.textContent = localStorage.getItem(bestKey()) || "--";
}

/* ----------------- Pour animation helper ----------------- */
function animatePour(fromIndex, toIndex, color, onComplete){
  if(prefersReducedMotion){
    onComplete && onComplete();
    return;
  }

  const fromEl = tubesEl.children[fromIndex];
  const toEl = tubesEl.children[toIndex];
  if(!fromEl || !toEl){ onComplete && onComplete(); return; }

  // create flying ball
  const fly = document.createElement("div");
  fly.className = `ball ${color}`;
  fly.style.position = "fixed";
  fly.style.zIndex = 999;
  fly.style.width = getComputedStyle(document.documentElement).getPropertyValue('--ball-size') || '26px';
  fly.style.height = fly.style.width;
  document.body.appendChild(fly);

  // compute start and end positions (center of top ball)
  const startRect = fromEl.getBoundingClientRect();
  const endRect = toEl.getBoundingClientRect();

  const startX = startRect.left + startRect.width / 2 - (parseFloat(fly.style.width)/2);
  const startY = startRect.top + startRect.height * 0.18; // near top of tube
  const endX = endRect.left + endRect.width / 2 - (parseFloat(fly.style.width)/2);
  const endY = endRect.top + endRect.height * 0.18;

  fly.style.left = `${startX}px`;
  fly.style.top = `${startY}px`;
  fly.style.transform = "scale(0.9)";
  fly.style.boxShadow = "0 10px 24px rgba(2,6,23,0.35)";

  // animate with requestAnimationFrame for smoothness
  const duration = 360;
  const start = performance.now();
  function step(now){
    const t = Math.min(1, (now - start) / duration);
    // easeInOutQuad
    const ease = t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
    const curX = startX + (endX - startX) * ease;
    const curY = startY + (endY - startY) * ease - Math.sin(ease * Math.PI) * 28; // arc
    const scale = 0.9 + 0.2 * (1 - Math.abs(0.5 - ease) * 2);
    fly.style.left = `${curX}px`;
    fly.style.top = `${curY}px`;
    fly.style.transform = `scale(${scale})`;
    if(t < 1) requestAnimationFrame(step);
    else {
      // small bounce on arrival
      fly.style.transition = "transform 140ms cubic-bezier(.2,.9,.2,1), opacity 120ms";
      fly.style.transform = "scale(0.98)";
      setTimeout(()=>{ document.body.removeChild(fly); onComplete && onComplete(); }, 140);
    }
  }
  requestAnimationFrame(step);
}

/* ----------------- Game logic ----------------- */
function click(i){
  if(selected === null){
    if(!tubes[i].length) return;
    selected = i;
    render();
  } else {
    if(selected === i){
      selected = null;
      render();
      return;
    }
    // attempt pour with animation
    const a = selected, b = i;
    if(!tubes[a].length || tubes[b].length === MAX_HEIGHT){ play("wrong"); selected = null; render(); return; }
    const c = tubes[a][tubes[a].length - 1];
    const t = tubes[b][tubes[b].length - 1];
    if(!t || t === c){
      // push history
      history.push(JSON.parse(JSON.stringify({ tubes, moves })));
      // animate visual pour then update state
      animatePour(a, b, c, () => {
        tubes[a].pop();
        tubes[b].push(c);
        moves++;
        play("pour");
        saveGame();
        checkWin();
        selected = null;
        render();
      });
    } else {
      play("wrong");
      selected = null;
      render();
    }
  }
}

/* ----------------- Hint ----------------- */
document.getElementById("hint").addEventListener("click", () => {
  document.querySelectorAll(".tube").forEach(t => t.classList.remove("hint"));
  for(let i=0;i<tubes.length;i++){
    for(let j=0;j<tubes.length;j++){
      if(i===j) continue;
      if(!tubes[i].length || tubes[j].length === MAX_HEIGHT) continue;
      const topI = tubes[i][tubes[i].length - 1];
      const topJ = tubes[j][tubes[j].length - 1];
      if(!topJ || topI === topJ){
        // add hint class with small delay for visibility
        tubesEl.children[i].classList.add("hint");
        tubesEl.children[j].classList.add("hint");
        setTimeout(()=>{ tubesEl.children[i].classList.remove("hint"); tubesEl.children[j].classList.remove("hint"); }, 1400);
        return;
      }
    }
  }
});

/* ----------------- Undo ----------------- */
document.getElementById("undo").addEventListener("click", () => {
  if(!history.length) return;
  const p = history.pop();
  tubes = p.tubes; moves = p.moves;
  saveGame(); render();
});

/* ----------------- Win detection & confetti ----------------- */
function checkWin(){
  const win = tubes.every(t => !t.length || (t.length === MAX_HEIGHT && t.every(c => c === t[0])));
  if(win){
    // save best
    const b = Number(localStorage.getItem(bestKey())) || Infinity;
    if(moves < b) localStorage.setItem(bestKey(), moves);
    play("win");
    document.querySelectorAll(".tube").forEach(t => t.classList.add("win"));
    nextBtn.classList.remove("hidden");
    // confetti burst
    confettiBurst();
  }
}

/* ----------------- Controls ----------------- */
nextBtn.addEventListener("click", () => { level++; start(); });
document.getElementById("reset").addEventListener("click", start);
diffSelect.addEventListener("change", () => {
  difficulty = diffSelect.value;
  MAX_HEIGHT = DIFFICULTY[difficulty];
  localStorage.setItem("cs_difficulty", difficulty);
  start();
});

/* ----------------- Init ----------------- */
function start(){
  history = []; moves = 0; selected = null;
  tubes = generate(); saveGame();
  nextBtn.classList.add("hidden");
  render();
}

if(!loadGame()) start();
render();

/* ----------------- Confetti implementation ----------------- */
(function setupConfetti(){
  if(!confettiCanvas) return;
  const ctx = confettiCanvas.getContext("2d");
  let W = confettiCanvas.width = window.innerWidth;
  let H = confettiCanvas.height = window.innerHeight;
  let particles = [];

  window.addEventListener("resize", () => { W = confettiCanvas.width = window.innerWidth; H = confettiCanvas.height = window.innerHeight; });

  function random(min, max){ return Math.random() * (max - min) + min; }

  function createParticles(x, y, count=40){
    for(let i=0;i<count;i++){
      particles.push({
        x, y,
        vx: random(-6,6),
        vy: random(-12,-4),
        size: random(6,12),
        color: `hsl(${Math.floor(random(0,360))}deg 80% 60%)`,
        rot: random(0,360),
        drag: 0.98,
        life: 0,
        ttl: random(60,120)
      });
    }
  }

  function update(){
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += 0.35; // gravity
      p.vx *= p.drag;
      p.vy *= 0.995;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vx * 0.5;
      p.life++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      ctx.restore();
      if(p.y > H + 50 || p.life > p.ttl) particles.splice(i,1);
    }
    requestAnimationFrame(update);
  }
  update();

  // expose burst function
  window.confettiBurst = function(x = W/2, y = H/3, count=60){
    if(prefersReducedMotion) return;
    createParticles(x, y, count);
  };
})();

/* ----------------- Utility: confettiBurst wrapper ----------------- */
function confettiBurst(){
  if(typeof window.confettiBurst === "function"){
    // center above tubes
    const rect = tubesEl.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 6;
    window.confettiBurst(x, y, 80);
  }
}

/* ----------------- Debug helper ----------------- */
window.csDebug = function(){
  console.log({ level, difficulty, MAX_HEIGHT, moves, tubes });
};
