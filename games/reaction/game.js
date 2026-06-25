const box = document.getElementById("box");
const startBtn = document.getElementById("startBtn");
const msg = document.getElementById("message");
const bestEl = document.getElementById("best");

let startTime = 0;
let timeoutId = null;
let bestTime = Number(localStorage.getItem("reactionBest")) || null;

if (bestTime) bestEl.textContent = bestTime;

// START GAME
function startGame() {
  msg.textContent = "Wait for green...";
  box.style.display = "none";
  box.style.background = "#ef4444";

  const delay = Math.random() * 3000 + 1500;
  timeoutId = setTimeout(() => {
    box.style.background = "#22c55e";
    box.style.display = "block";
    startTime = Date.now();
  }, delay);
}

startBtn.addEventListener("click", startGame);
startBtn.addEventListener("touchstart", startGame);

// CLICK BOX
function registerClick() {
  if (!startTime) return;
  const reactionTime = Date.now() - startTime;
  msg.textContent = `⚡ Your reaction time: ${reactionTime} ms`;
  box.style.display = "none";

  if (!bestTime || reactionTime < bestTime) {
    bestTime = reactionTime;
    localStorage.setItem("reactionBest", bestTime);
    bestEl.textContent = bestTime;
  }
  startTime = 0;
}

box.addEventListener("click", registerClick);
box.addEventListener("touchstart", registerClick);

// FALSE CLICK DETECTION
document.body.addEventListener("click", e => {
  if (e.target.id !== "startBtn" && e.target.id !== "box" && timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
    msg.textContent = "❌ Too soon! Click Start again.";
  }
});
document.body.addEventListener("touchstart", e => {
  if (e.target.id !== "startBtn" && e.target.id !== "box" && timeoutId) {
    clearTimeout(timeoutId);
    timeoutId = null;
    msg.textContent = "❌ Too soon! Tap Start again.";
  }
});
