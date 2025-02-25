// Selección de elementos
const movesCountElement = document.getElementById("moves-count");
const timeElement = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const controlsContainer = document.querySelector(".controls-container");

let cards;
let firstCard = null;
let secondCard = null;
let hasFlippedCard = false;
let lockBoard = false;
let matchedPairs = 0;
let movesCount = 0;
let time = 0;
let timer;

// Lista de imágenes (puedes reemplazarlas con URLs o rutas de imágenes)
const images = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
const cardPairs = [...images, ...images]; // Duplicamos las imágenes para formar parejas

// Baraja las cartas de forma aleatoria
const shuffleCards = () => {
  cardPairs.sort(() => Math.random() - 0.5);
};

// Inicia el temporizador
const startTimer = () => {
  timer = setInterval(() => {
    time++;
    timeElement.innerText = `Tiempo: ${time} s`;
  }, 1000);
};

// Muestra las cartas en el tablero
const generateCards = () => {
  shuffleCards();
  gameContainer.innerHTML = "";
  cardPairs.forEach((emoji) => {
    const card = document.createElement("div");
    card.classList.add("card-container");
    card.innerHTML = `
      <div class="card-before">❓</div>
      <div class="card-after">${emoji}</div>
    `;
    card.addEventListener("click", flipCard);
    gameContainer.appendChild(card);
  });
  cards = document.querySelectorAll(".card-container");
};

// Lógica para voltear las cartas
const flipCard = function () {
  if (lockBoard || this === firstCard) return;
  
  this.classList.add("flipped");

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  movesCount++;
  movesCountElement.innerText = `Movimientos: ${movesCount}`;

  checkMatch();
};

// Verifica si las cartas son iguales
const checkMatch = () => {
  let isMatch = firstCard.innerHTML === secondCard.innerHTML;

  if (isMatch) {
    matchedPairs++;
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }

  // Verificar si ganó
  if (matchedPairs === images.length) {
    clearInterval(timer);
    setTimeout(() => {
      alert(`¡Ganaste en ${movesCount} movimientos y ${time} segundos! 🎉`);
      resetGame();
    }, 500);
  }
};

// Reinicia la selección de cartas
const resetBoard = () => {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

// Inicia el juego
const startGame = () => {
  matchedPairs = 0;
  movesCount = 0;
  time = 0;
  movesCountElement.innerText = `Movimientos: ${movesCount}`;
  timeElement.innerText = `Tiempo: ${time} s`;
  controlsContainer.classList.add("hide");
  stopButton.classList.remove("hide");
  generateCards();
  startTimer();
};

// Reinicia el juego
const resetGame = () => {
  clearInterval(timer);
  controlsContainer.classList.remove("hide");
  stopButton.classList.add("hide");
  gameContainer.innerHTML = "";
};

// Event Listeners
startButton.addEventListener("click", startGame);
stopButton.addEventListener("click", resetGame);
