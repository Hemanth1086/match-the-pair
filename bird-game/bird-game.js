const game = document.getElementById("game");
const bird = document.getElementById("bird");
const scoreElement = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

let birdY = 120;
let score = 0;
let gameOver = false;
let spawnIntervalId = null;
let clouds = [];

const gameHeight = game.clientHeight;
const birdHeight = 50;
const moveStep = 20;
const cloudSpeed = 3;
const tickMs = 20;

// move bird with keyboard
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  if (e.code === "ArrowUp") {
    birdY = Math.max(0, birdY - moveStep);
  } else if (e.code === "ArrowDown") {
    birdY = Math.min(gameHeight - birdHeight, birdY + moveStep);
  }
  bird.style.top = birdY + "px";
});

// spawn cloud
function createCloud() {
  if (gameOver) return;

  const cloud = document.createElement("div");
  cloud.className = "cloud";
  cloud.style.top = Math.floor(Math.random() * (gameHeight - 40)) + "px";
  cloud.style.left = game.clientWidth + "px";

  game.appendChild(cloud);

  clouds.push({ el: cloud, x: game.clientWidth, passed: false });
}

// floating +100 popup
function showPopup(x, y) {
  const popup = document.createElement("div");
  popup.textContent = "+100";
  popup.className = "popup";
  popup.style.left = x + "px";
  popup.style.top = y + "px";
  game.appendChild(popup);

  // remove after animation
  setTimeout(() => popup.remove(), 1000);
}

// game loop
const loop = setInterval(() => {
  if (gameOver) return;

  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x -= cloudSpeed;
    c.el.style.left = c.x + "px";

    const birdRect = bird.getBoundingClientRect();
    const cloudRect = c.el.getBoundingClientRect();

    // collision detection
    if (
      birdRect.right > cloudRect.left &&
      birdRect.left < cloudRect.right &&
      birdRect.bottom > cloudRect.top &&
      birdRect.top < cloudRect.bottom
    ) {
      endGame();
      return;
    }

    // if cloud passes the bird safely
    if (!c.passed && c.x + c.el.offsetWidth < bird.offsetLeft) {
      c.passed = true;
      score += 100;
      scoreElement.textContent = "Score: " + score;
      showPopup(bird.offsetLeft + 60, birdY);
    }

    // remove cloud when fully off screen
    if (c.x + c.el.offsetWidth < 0) {
      c.el.remove();
      clouds.splice(i, 1);
    }
  }
}, tickMs);

// start spawning clouds
function startSpawning() {
  createCloud();
  spawnIntervalId = setInterval(createCloud, 1600 + Math.random() * 800);
}

function startGame() {
  birdY = Math.floor((gameHeight - birdHeight) / 2);
  bird.style.top = birdY + "px";
  score = 0;
  gameOver = false;
  scoreElement.textContent = "Score: 0";

  clouds.forEach(c => c.el.remove());
  clouds = [];

  if (spawnIntervalId) clearInterval(spawnIntervalId);
  startSpawning();
}

function endGame() {
  gameOver = true;
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  scoreElement.textContent = "Game Over! Final Score: " + score;
  clouds.forEach(c => c.el.remove());
  clouds = [];
}

restartBtn.addEventListener("click", () => {
  if (spawnIntervalId) clearInterval(spawnIntervalId);
  startGame();
});

// start game on load
startGame();
