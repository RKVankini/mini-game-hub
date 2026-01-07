const app = document.getElementById("app");
const themeToggle = document.getElementById("themeToggle");

/* ---------- HOME SCREEN ---------- */
function loadHome() {
  app.innerHTML = `
    <section>
      <h2 style="margin-bottom:20px;">Choose a Game</h2>

      <div class="game-grid">
        <div class="game-card" onclick="loadGame('memory')">
          <h3>🧠 Memory Game</h3>
          <p>Test your memory skills</p>
        </div>

        <div class="game-card" onclick="loadGame('reaction')">
          <h3>⚡ Reaction Speed</h3>
          <p>How fast are you?</p>
        </div>

        <div class="game-card" onclick="loadGame('color-sort')">
          <h3>🧪 Color Sort Puzzle</h3>
          <p>Logic-based puzzle with levels & hints</p>
        </div>

        <div class="game-card" onclick="loadGame('quiz')">
          <h3>❓ Quiz Game</h3>
          <p>Answer & score</p>
        </div>

        <div class="game-card" onclick="loadGame('sliding-puzzle')">
          <h3>🧩 Sliding Puzzle</h3>
          <p>Rearrange tiles to solve the puzzle</p>
        </div>
      </div>
    </section>
  `;
}

/* ---------- GAME LOADER ---------- */
function loadGame(game) {
  app.innerHTML = `
    <button onclick="loadHome()">⬅ Back</button>
    <div id="gameContainer" style="margin-top:20px;">
      <h2>Loading ${game.replace("-", " ")}...</h2>
    </div>
  `;

  // 🧹 Remove previously loaded game script (VERY IMPORTANT)
  const oldScript = document.getElementById("gameScript");
  if (oldScript) oldScript.remove();

  fetch(`games/${game}/index.html`)
    .then(res => {
      if (!res.ok) throw new Error("Game not found");
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
