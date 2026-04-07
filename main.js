const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");

/* ---------- HOME ---------- */
function loadHome() {
  app.innerHTML = `
    <section class="home">
      <h2>Choose a Game</h2>

      <div class="game-grid">
        ${gameCard("memory", "🧠", "Memory Game", "Test your memory skills")}
        ${gameCard("reaction", "⚡", "Reaction Speed", "How fast are you?")}
        ${gameCard("color-sort", "🧪", "Color Sort Puzzle", "Logic-based puzzle")}
        ${gameCard("quiz", "❓", "Quiz Game", "Answer & score")}
        // ${gameCard("sliding-puzzle", "🧩", "Sliding Puzzle", "Rearrange tiles")}
        // ${gameCard("word-scramble", "🔀", "Word Scramble", "Unscramble the word")}
        // ${gameCard("jigsaw","🧩","Jigsaw Puzzle","Complete the picture")}
      </div>
    </section>
  `;
}

/* ---------- CARD TEMPLATE ---------- */
function gameCard(id, icon, title, desc) {
  return `
    <div class="game-card" onclick="loadGame('${id}')">
      <h3>${icon} ${title}</h3>
      <p>${desc}</p>
    </div>
  `;
}

/* ---------- GAME LOADER ---------- */
function loadGame(game) {
  app.innerHTML = `
    <button onclick="loadHome()">⬅ Back</button>
    <div id="gameContainer" style="margin-top:24px;"></div>
  `;

  // Remove previous game script
  const oldScript = document.getElementById("gameScript");
  if (oldScript) oldScript.remove();

  // Load game page
  fetch(`games/${game}/index.html`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.text();
    })
    .then(html => {
      document.getElementById("gameContainer").innerHTML = html;

      const script = document.createElement("script");
      script.src = `games/${game}/game.js`;
      script.id = "gameScript";
      script.defer = true;
      document.body.appendChild(script);
    })
    .catch(() => {
      document.getElementById("gameContainer").innerHTML =
        "<p>❌ Game not found.</p>";
    });
}

/* ---------- THEME ---------- */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

/* ---------- INIT ---------- */
loadHome();
