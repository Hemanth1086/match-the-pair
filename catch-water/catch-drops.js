const gameArea = document.getElementById("game-area");
const bucket = document.getElementById("bucket");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");

let score = 0;
let gameInterval;
let dropInterval;
let timerInterval;
let gameOver = false;
let timeLeft = 30;

// Move bucket with arrow keys (faster speed)
document.addEventListener("keydown", (e) => {
  if (gameOver) return;
  let left = parseInt(window.getComputedStyle(bucket).getPropertyValue("left"));
  if (e.key === "ArrowLeft" && left > 0) {
    bucket.style.left = left - 40 + "px";
  } else if (e.key === "ArrowRight" && left < 330) {
    bucket.style.left = left + 40 + "px";
  }
});

// Create falling item
function createItem() {
  if (gameOver) return;

  const item = document.createElement("div");
  const isDrop = Math.random() > 0.3; // 70% chance it's a water drop
  item.classList.add(isDrop ? "drop" : "bad");
  item.textContent = isDrop ? "💧" : "🚰";

  item.style.left = Math.floor(Math.random() * 370) + "px";
  gameArea.appendChild(item);

  let fallInterval = setInterval(() => {
    let itemTop = parseInt(window.getComputedStyle(item).getPropertyValue("top") || 0);
    if (itemTop > 470) {
      item.remove();
      clearInterval(fallInterval);
    } else {
      item.style.top = itemTop + 5 + "px";

      // Collision detection
      let bucketRect = bucket.getBoundingClientRect();
      let itemRect = item.getBoundingClientRect();

      if (
        itemRect.bottom >= bucketRect.top &&
        itemRect.left >= bucketRect.left &&
        itemRect.right <= bucketRect.right
      ) {
        if (item.classList.contains("drop")) {
          score += 10;
          showPopup("+10", "#2e7d32");
        } else {
          score -= 5;
          showPopup("-5", "#d32f2f");
        }
        scoreElement.textContent = score;
        item.remove();
        clearInterval(fallInterval);
      }
    }
  }, 40);
}

// 🎉 Popup function
function showPopup(text, color) {
  const popupContainer = document.getElementById("popup-container");
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.style.color = color;
  popup.textContent = text;

  popupContainer.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000);
}

// Start game
function startGame() {
  score = 0;
  scoreElement.textContent = score;
  timeLeft = 30;
  timerElement.textContent = timeLeft;
  gameOver = false;

  // Start countdown timer
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerElement.textContent = timeLeft;
    } else {
      endGame();
    }
  }, 1000);

  // End game after 30s
  gameInterval = setTimeout(() => {
    endGame();
  }, 30000);

  // Start falling items
  dropInterval = setInterval(createItem, 1000);
}

function endGame() {
  if (gameOver) return;
  gameOver = true;

  clearInterval(dropInterval);
  clearInterval(timerInterval);
  clearTimeout(gameInterval);

  showPopup("Game Over! Final Score: " + score, "#0277bd");
}

function restartGame() {
  clearInterval(dropInterval);
  clearInterval(timerInterval);
  clearTimeout(gameInterval);
  document.querySelectorAll(".drop, .bad").forEach(el => el.remove());
  startGame();
}

// Initialize
startGame();
