/* main.js — hub logic: builds cards, keyboard/touch accessibility, storage clear, open all */
const games = [
  { id:"jigsaw", title:"Jigsaw Puzzle", desc:"Arrange pieces to complete the image.", path:"./games/jigsaw/index.html", category:"puzzle" },
  { id:"color-sort", title:"Color Sort Puzzle", desc:"Sort colors into tubes.", path:"./games/color-sort/index.html", category:"puzzle" },
  { id:"memory", title:"Memory Game", desc:"Match pairs before time runs out.", path:"./games/memory/index.html", category:"brain" },
  { id:"quiz", title:"Quiz Game", desc:"Quick trivia across categories.", path:"./games/quiz/index.html", category:"brain" },
  { id:"reaction", title:"Reaction Speed", desc:"Test your reaction time.", path:"./games/reaction/index.html", category:"speed" }
];

const grid = document.getElementById("gamesGrid");
const search = document.getElementById("search");
const filter = document.getElementById("filter");
const openAll = document.getElementById("openAll");
const clearStorage = document.getElementById("clearStorage");
document.getElementById("year").textContent = new Date().getFullYear();

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
    // avoid double-activating when clicking the play link itself
    if(e.target === play) return;
    window.location.href = g.path;
  });

  meta.appendChild(play);
  card.appendChild(h); card.appendChild(p); card.appendChild(meta);
  return card;
}

function render(list){
  grid.innerHTML = "";
  const frag = document.createDocumentFragment();
  list.forEach(g => frag.appendChild(createCard(g)));
  grid.appendChild(frag);
}

// initial render
render(games);

// search & filter
function applyFilters(){
  const q = search.value.trim().toLowerCase();
  const cat = filter.value;
  const filtered = games.filter(g=>{
    const matchesQ = !q || g.title.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q);
    const matchesCat = cat === "all" || g.category === cat;
    return matchesQ && matchesCat;
  });
  render(filtered);
}
search.addEventListener("input", applyFilters);
filter.addEventListener("change", applyFilters);

// open all in new tabs (useful for testing)
openAll.addEventListener("click", ()=>{
  games.forEach(g => window.open(g.path, "_blank"));
});

// clear saved data
clearStorage.addEventListener("click", ()=>{
  if(confirm("Clear saved game data (localStorage) for all games?")) {
    // only clear keys that belong to this hub (safe approach)
    Object.keys(localStorage).forEach(k=>{
      if(k.startsWith("cs_") || k.startsWith("best_") || k.includes("reactionBest")) localStorage.removeItem(k);
    });
    alert("Saved data cleared.");
  }
});

// keyboard shortcut: "/" focuses search
document.addEventListener("keydown", e=>{
  if(e.key === "/"){ e.preventDefault(); search.focus(); }
});

// Accessibility: ensure links work when opened from GitHub Pages subpath
// No extra code required if you use relative paths like "./games/..." and "./assets/..."

