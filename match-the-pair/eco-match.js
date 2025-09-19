const board = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
let score = 0;
let firstCard, secondCard;
let lockBoard = false;

// Example pairs (replace with Pinterest images later)
const pairs = {
  tree: "oxygen",
  oxygen: "tree",
  cow: "milk",
  milk: "cow",
  bee: "honey",
  honey: "bee",
  sun: "solar",
  solar: "sun"
};

const cardsArray = Object.keys(pairs).map(key => {
  return { name: key, img: `img/${key}.jpg` };
});

// Duplicate pairs
let gameCards = [...cardsArray, ...cardsArray];

// Shuffle cards
gameCards.sort(() => 0.5 - Math.random());

// Generate board
function createBoard() {
  board.innerHTML = "";
  gameCards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.dataset.name = card.name;

    cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">🌱</div>
        <div class="card-back">
          <img src="${card.img}" alt="${card.name}" width="100" height="100">
        </div>
      </div>
    `;

    cardElement.addEventListener("click", flipCard);
    board.appendChild(cardElement);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  let name1 = firstCard.dataset.name;
  let name2 = secondCard.dataset.name;

  let isMatch = pairs[name1] === name2;

  if (isMatch) {
    triggerBombEffect(firstCard, secondCard);
    showPopup("+100"); // 👈 add popup
    disableCards();
    score += 100;
    scoreElement.textContent = score;
  } else {
    unflipCards();
  }
}

// 🎉 Popup function
function showPopup(text) {
  const popupContainer = document.getElementById("popup-container");
  const popup = document.createElement("div");
  popup.classList.add("popup");
  popup.textContent = text;

  popupContainer.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 1000); // disappears after 1s
}


// 💣 Bomb Effect
function triggerBombEffect(card1, card2) {
  [card1, card2].forEach(card => {
    const bomb = document.createElement("div");
    bomb.classList.add("bomb-effect");
    bomb.textContent = "💥";
    card.appendChild(bomb);

    setTimeout(() => {
      bomb.remove();
    }, 600); // effect duration
  });
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function restartGame() {
  score = 0;
  scoreElement.textContent = score;
  gameCards.sort(() => 0.5 - Math.random());
  createBoard();
}

// Initialize
createBoard();
