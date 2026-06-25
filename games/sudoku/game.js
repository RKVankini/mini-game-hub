/* Sudoku game.js
   - Generator using randomized backtracking
   - Difficulty by removing clues
   - Solver for hints and solve
   - UI: keyboard, touch, pencil marks, undo, hint, validate, timer, persistence
*/

const boardEl = document.getElementById("board");
const difficultyEl = document.getElementById("difficulty");
const newGameBtn = document.getElementById("newGame");
const timerEl = document.getElementById("timer");
const movesEl = document.getElementById("moves");
const pencilBtn = document.getElementById("pencil");
const hintBtn = document.getElementById("hint");
const undoBtn = document.getElementById("undo");
const validateBtn = document.getElementById("validate");
const solveBtn = document.getElementById("solve");
const messageEl = document.getElementById("message");

let solution = [];      // full solved board 9x9
let puzzle = [];        // current puzzle state 9x9 (0 empty)
let fixed = [];         // boolean grid for prefilled cells
let pencilMarks = {};   // map "r-c" -> Set of numbers
let selected = null;    // [r,c]
let pencilMode = false;
let moves = 0;
let history = [];
let timer = null;
let seconds = 0;

// persistence key
const SAVE_KEY = "sudoku_save_v1";

// utility
const range = n => Array.from({length:n}, (_,i)=>i);
function cloneGrid(g){ return g.map(row => row.slice()); }
function key(r,c){ return `${r}-${c}`; }

// initialize UI grid
function buildBoard(){
  boardEl.innerHTML = "";
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.setAttribute("role","gridcell");
      cell.setAttribute("tabindex","0");
      cell.dataset.r = r; cell.dataset.c = c;
      cell.addEventListener("click", () => onCellClick(r,c));
      cell.addEventListener("touchstart", (e) => { e.preventDefault(); onCellClick(r,c); });
      cell.addEventListener("keydown", (e) => {
        if(e.key >= "1" && e.key <= "9") onNumberInput(Number(e.key));
        if(e.key === "Backspace" || e.key === "Delete" || e.key === "0") clearCell();
        if(e.key === "ArrowUp") focusCell(Math.max(0,r-1), c);
        if(e.key === "ArrowDown") focusCell(Math.min(8,r+1), c);
        if(e.key === "ArrowLeft") focusCell(r, Math.max(0,c-1));
        if(e.key === "ArrowRight") focusCell(r, Math.min(8,c+1));
        if(e.key === "Enter") togglePencil();
      });
      boardEl.appendChild(cell);
    }
  }
}

// focus helper
function focusCell(r,c){
  const el = boardEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  if(el){ el.focus(); onCellClick(r,c); }
}

// render puzzle to DOM
function render(){
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      const idx = r*9 + c;
      const el = boardEl.children[idx];
      el.classList.remove("prefilled","selected","error");
      el.innerHTML = "";
      const val = puzzle[r][c];
      if(fixed[r][c]){
        el.classList.add("prefilled");
        el.textContent = val || "";
      } else if(val){
        el.textContent = val;
      } else {
        // pencil marks
        const marks = pencilMarks[key(r,c)];
        if(marks && marks.size){
          const pm = document.createElement("div");
          pm.className = "pencil";
          for(let n=1;n<=9;n++){
            const span = document.createElement("span");
            span.textContent = marks.has(n) ? n : "";
            pm.appendChild(span);
          }
          el.appendChild(pm);
        }
      }
      if(selected && selected[0]===r && selected[1]===c) el.classList.add("selected");
    }
  }
  movesEl.textContent = moves;
}

// generator: randomized backtracking
function generateFullSolution(){
  const grid = Array.from({length:9}, ()=>Array(9).fill(0));
  const nums = [1,2,3,4,5,6,7,8,9];

  function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

  function canPlace(g,r,c,n){
    for(let i=0;i<9;i++){ if(g[r][i]===n || g[i][c]===n) return false; }
    const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
    for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(g[br+i][bc+j]===n) return false;
    return true;
  }

  function fill(pos=0){
    if(pos===81) return true;
    const r = Math.floor(pos/9), c = pos%9;
    const order = shuffle(nums.slice());
    for(const n of order){
      if(canPlace(grid,r,c,n)){
        grid[r][c]=n;
        if(fill(pos+1)) return true;
        grid[r][c]=0;
      }
    }
    return false;
  }

  fill();
  return grid;
}

// remove clues by difficulty while ensuring unique solution
function makePuzzleFromSolution(sol, difficulty){
  // copy
  let p = cloneGrid(sol);
  // removal order random
  const cells = range(81).sort(()=>Math.random()-0.5);
  // target removals
  let removals = difficulty === "easy" ? 36 : difficulty === "medium" ? 46 : 54;
  // solver that counts solutions up to 2
  function countSolutions(grid){
    let count = 0;
    function canPlace(g,r,c,n){
      for(let i=0;i<9;i++){ if(g[r][i]===n || g[i][c]===n) return false; }
      const br = Math.floor(r/3)*3, bc = Math.floor(c/3)*3;
      for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(g[br+i][bc+j]===n) return false;
      return true;
    }
    function solve(pos=0){
      if(count>1) return;
      if(pos===81){ count++; return; }
      const r=Math.floor(pos/9), c=pos%9;
      if(grid[r][c]!==0) return solve(pos+1);
      for(let n=1;n<=9;n++){
        if(canPlace(grid,r,c,n)){
          grid[r][c]=n;
          solve(pos+1);
          grid[r][c]=0;
          if(count>1) return;
        }
      }
    }
    solve();
    return count;
  }

  for(const idx of cells){
    if(removals<=0) break;
    const r=Math.floor(idx/9), c=idx%9;
    const backup = p[r][c];
    p[r][c]=0;
    // test uniqueness by copying
    const copy = cloneGrid(p);
    const sols = countSolutions(copy);
    if(sols===1){
      removals--;
    } else {
      p[r][c]=backup; // revert
    }
  }
  return p;
}

// start new game
function newGame(difficulty){
  stopTimer();
  seconds = 0; updateTimer();
  moves = 0; history = []; pencilMarks = {};
  // generate
  solution = generateFullSolution();
  puzzle = makePuzzleFromSolution(solution, difficulty);
  fixed = Array.from({length:9}, (_,r)=>Array.from({length:9}, (_,c)=>puzzle[r][c]!==0));
  selected = null;
  saveState();
  render();
  startTimer();
  showMessage("New game started");
}

// input handlers
function onCellClick(r,c){
  if(fixed[r][c]) { selected = [r,c]; render(); return; }
  selected = [r,c];
  render();
}

function onNumberInput(n){
  if(!selected) return;
  const [r,c] = selected;
  if(fixed[r][c]) return;
  if(pencilMode){
    const k = key(r,c);
    if(!pencilMarks[k]) pencilMarks[k] = new Set();
    if(pencilMarks[k].has(n)) pencilMarks[k].delete(n);
    else pencilMarks[k].add(n);
    // if pencil marks empty, delete key
    if(pencilMarks[k] && pencilMarks[k].size===0) delete pencilMarks[k];
    pushHistory();
    render();
    return;
  }
  // place number and validate immediate conflicts
  const prev = puzzle[r][c];
  puzzle[r][c] = n;
  // clear pencil marks for cell
  delete pencilMarks[key(r,c)];
  pushHistory(prev ? {r,c,prev} : {r,c,prev:0});
  moves++;
  render();
  saveState();
  if(checkComplete()) {
    stopTimer();
    showMessage("Congratulations! Puzzle solved.");
  }
}

function clearCell(){
  if(!selected) return;
  const [r,c] = selected;
  if(fixed[r][c]) return;
  const prev = puzzle[r][c];
  if(prev===0) return;
  puzzle[r][c]=0;
  delete pencilMarks[key(r,c)];
  pushHistory({r,c,prev});
  moves++;
  render();
  saveState();
}

function togglePencil(){
  pencilMode = !pencilMode;
  pencilBtn.classList.toggle("active", pencilMode);
  showMessage(pencilMode ? "Pencil mode on" : "Pencil mode off");
}

// history for undo
function pushHistory(entry){
  history.push({
    puzzle: cloneGrid(puzzle),
    pencil: JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(pencilMarks).map(([k,s])=>[k,Array.from(s)])))),
    moves
  });
  // cap history
  if(history.length>200) history.shift();
}

function undo(){
  if(!history.length) { showMessage("Nothing to undo"); return; }
  const last = history.pop();
  puzzle = cloneGrid(last.puzzle);
  pencilMarks = Object.fromEntries(Object.entries(last.pencil).map(([k,a])=>[k,new Set(a)]));
  moves = last.moves;
  render();
  saveState();
  showMessage("Undo");
}

// hint: fill one correct cell that is empty
function hint(){
  // find empty cell
  for(let r=0;r<9;r++){
    for(let c=0;c<9;c++){
      if(puzzle[r][c]===0){
        pushHistory();
        puzzle[r][c] = solution[r][c];
        delete pencilMarks[key(r,c)];
        moves++;
        render();
        saveState();
        showMessage(`Hint placed at row ${r+1}, column ${c+1}`);
        return;
      }
    }
  }
  showMessage("No hints available");
}

// validate: mark conflicts
function validate(){
  // clear errors
  for(let r=0;r<9;r++) for(let c=0;c<9;c++){
    const el = boardEl.children[r*9+c];
    el.classList.remove("error");
  }
  let hasError = false;
  function markError(r,c){ boardEl.children[r*9+c].classList.add("error"); hasError = true; }
  // check rows, cols, blocks
  for(let r=0;r<9;r++){
    const seen = {};
    for(let c=0;c<9;c++){
      const v = puzzle[r][c];
      if(!v) continue;
      if(seen[v]) { markError(r,c); markError(r,seen[v]-1); }
      else seen[v]=c+1;
    }
  }
  for(let c=0;c<9;c++){
    const seen = {};
    for(let r=0;r<9;r++){
      const v = puzzle[r][c];
      if(!v) continue;
      if(seen[v]) { markError(r,c); markError(seen[v]-1,c); }
      else seen[v]=r+1;
    }
  }
  for(let br=0;br<3;br++){
    for(let bc=0;bc<3;bc++){
      const seen = {};
      for(let r=br*3;r<br*3+3;r++){
        for(let c=bc*3;c<bc*3+3;c++){
          const v = puzzle[r][c];
          if(!v) continue;
          if(seen[v]) { markError(r,c); const [rr,cc] = seen[v]; markError(rr,cc); }
          else seen[v]=[r,c];
        }
      }
    }
  }
  showMessage(hasError ? "Conflicts found" : "No conflicts detected");
}

// check complete and correct
function checkComplete(){
  for(let r=0;r<9;r++) for(let c=0;c<9;c++) if(puzzle[r][c]===0 || puzzle[r][c]!==solution[r][c]) return false;
  return true;
}

// solve: fill all cells with solution
function solve(){
  pushHistory();
  puzzle = cloneGrid(solution);
  render();
  saveState();
  stopTimer();
  showMessage("Solved");
}

// timer
function startTimer(){
  stopTimer();
  timer = setInterval(()=>{ seconds++; updateTimer(); }, 1000);
}
function stopTimer(){ if(timer) clearInterval(timer); timer = null; }
function updateTimer(){
  const mm = String(Math.floor(seconds/60)).padStart(2,"0");
  const ss = String(seconds%60).padStart(2,"0");
  timerEl.textContent = `${mm}:${ss}`;
}

// persistence
function saveState(){
  const state = {
    puzzle, solution, fixed, pencil: Object.fromEntries(Object.entries(pencilMarks).map(([k,s])=>[k,Array.from(s)])),
    moves, seconds, difficulty: difficultyEl.value
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}
function loadState(){
  try{
    const raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return false;
    const s = JSON.parse(raw);
    puzzle = s.puzzle; solution = s.solution; fixed = s.fixed;
    pencilMarks = Object.fromEntries(Object.entries(s.pencil||{}).map(([k,a])=>[k,new Set(a)]));
    moves = s.moves||0; seconds = s.seconds||0;
    difficultyEl.value = s.difficulty || "easy";
    render(); updateTimer(); startTimer();
    return true;
  }catch(e){ return false; }
}

// messages
let msgTimer = null;
function showMessage(txt, timeout=3000){
  messageEl.textContent = txt;
  if(msgTimer) clearTimeout(msgTimer);
  if(timeout>0) msgTimer = setTimeout(()=>{ messageEl.textContent = ""; }, timeout);
}

// UI number pad
document.querySelectorAll(".num").forEach(btn=>{
  btn.addEventListener("click", ()=> onNumberInput(Number(btn.dataset.num)));
});

// control buttons
pencilBtn.addEventListener("click", togglePencil);
hintBtn.addEventListener("click", hint);
undoBtn.addEventListener("click", undo);
validateBtn.addEventListener("click", validate);
solveBtn.addEventListener("click", solve);
newGameBtn.addEventListener("click", ()=> newGame(difficultyEl.value));

// keyboard global: 0/Backspace clears, numbers input
document.addEventListener("keydown", (e)=>{
  if(e.key >= "1" && e.key <= "9") onNumberInput(Number(e.key));
  if(e.key === "0" || e.key === "Backspace" || e.key === "Delete") clearCell();
  if(e.key === "p") togglePencil();
  if(e.key === "u") undo();
});

// initial setup
buildBoard();
if(!loadState()){
  newGame(difficultyEl.value);
} else {
  showMessage("Loaded saved game");
}
render();
updateTimer();

/* Expose debug helpers */
window.sudoku = {
  newGame: (d)=>newGame(d||"easy"),
  solve,
  getState: ()=>({puzzle,solution,fixed,moves,seconds})
};
