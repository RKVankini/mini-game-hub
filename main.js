/* main.js — hub logic with PWA install support and Sudoku added */
const games = [
  { id:"jigsaw", title:"Jigsaw Puzzle", desc:"Arrange pieces to complete the image.", path:"./games/jigsaw/index.html", category:"puzzle" },
  { id:"color-sort", title:"Color Sort Puzzle", desc:"Sort colors into tubes.", path:"./games/color-sort/index.html", category:"puzzle" },
  { id:"memory", title:"Memory Game", desc:"Match pairs before time runs out.", path:"./games/memory/index.html", category:"brain" },
  { id:"quiz", title:"Quiz Game", desc:"Quick trivia across categories.", path:"./games/quiz/index.html", category:"brain" },
  { id:"reaction", title:"Reaction Speed", desc:"Test your reaction time.", path:"./games/reaction/index.html", category:"speed" },
  { id:"sudoku", title:"Sudoku", desc:"Classic 9x9 logic puzzle with pencil marks and hints.", path:"./games/sudoku/index.html", category:"puzzle" }
];

const grid = document.getElementById("gamesGrid");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const openAll = document.getElementById("openAll");
const clearStorage = document.getElementById("clearStorage");
const yearEl = document.getElementById("year");
const installBtn = document.getElementById("installBtn");

if (yearEl) yearEl.textContent = new Date().getFullYear();

function createCard(g){
  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("tabindex","0");
  card.setAttribute("role","article");
  card.dataset.category = g.category;

  const h = document.createElement("h3"); h.textContent = g.title;
  const p = document.createElement("p"); p.textContent = g.desc;

  const meta = document.createElement("div"); meta.className = "meta";
  const play = document.createElement("a");
  play.className = "play";
  play.href = g.path;
  play.textContent = "Play";
  play.setAttribute("aria-label", `Play ${g.title}`);
  play.setAttribute("target","_self");

  // keyboard: Enter opens game
  card.addEventListener("keydown", e=>{
    if(e.key === "Enter" || e.key === " ") { e.preventDefault(); play.click(); }
  });

  // accessible click area: clicking card opens game
  card.addEventListener("click", e=>{
    if(e.target === play) return;
    window.location.href = g.path;
  });

  meta.appendChild(play);
  card.appendChild(h); card.appendChild(p); card.appendChild(meta);
  return card;
}

function render(list){
  if(!grid) return;
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach(g => frag.appendChild(createCard(g)));
  grid.appendChild(frag);
}

// initial render
render(games);

// search & filter
function applyFilters(){
  if(!search || !filter) return;
  const q = search.value.trim().toLowerCase();
  const cat = filter.value;
  const filtered = games.filter(g=>{
    const matchesQ = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
    const matchesCat = cat === "all" || g.category === cat;
    return matchesQ && matchesCat;
  });
  render(filtered);
}
if (search) search.addEventListener("input", applyFilters);
if (filter) filter.addEventListener("change", applyFilters);

// open all in new tabs (useful for testing)
if (openAll) openAll.addEventListener("click", ()=>{
  games.forEach(g => window.open(g.path, "_blank"));
});

// clear saved data
if (clearStorage) clearStorage.addEventListener("click", ()=>{
  if(!confirm("Clear saved game data (localStorage) for all games?")) return;
  Object.keys(localStorage).forEach(k=>{
    if(k.startsWith("cs_") || k.startsWith("best_") || k.includes("reactionBest") || k.startsWith("quiz_") || k.startsWith("sudoku_")) {
      localStorage.removeItem(k);
    }
  });
  alert("Saved data cleared.");
});

// keyboard shortcut: "/" focuses search
document.addEventListener("keydown", e=>{
  if(e.key === "/" && search){ e.preventDefault(); search.focus(); }
});

// PWA: register service worker and handle beforeinstallprompt
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => console.log('Service worker registered'))
    .catch(err => console.warn('SW registration failed:', err));
}

let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'inline-block';
});

if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}

// Accessibility: ensure links work when opened from GitHub Pages subpath
// Use relative paths like "./games/..." and "./assets/..." so the hub works under repo pages.
