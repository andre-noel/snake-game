const DIREITA = { x: 1, y: 0 };
const ESQUERDA = { x: -1, y: 0 };
const CIMA = { x: 0, y: -1 };
const BAIXO = { x: 0, y: 1 };

const boardSize = 20;

const initialState = {
  snake: [{ x: 0, y: 0 }],
  coffee: generateCoffee(),
  direction: DIREITA,
  gameOver: false,
  points: 0,
};

// Cria tabuleiro
const board = document.getElementById("board");
for (let index = 0; index < boardSize * boardSize; index += 1) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  board.appendChild(cell);
}

const desenhaTabuleiro = (state) => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.className = "cell"));
  const [cabeca, ...cauda] = state.snake;
  const index = cabeca.y * boardSize + cabeca.x;
  cells[index].classList.add("snake");
  cauda.forEach((pedaco) => {
    const index = pedaco.y * boardSize + pedaco.x;
    cells[index].classList.add("cauda");
  });

  const coffeeIndex = state.coffee.y * boardSize + state.coffee.x;
  cells[coffeeIndex].classList.add("coffee");

  const score = document.getElementById("score");
  score.innerText = state.points;
};

const moveSnake = (snake, direction) => {
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  newHead.x = (newHead.x + boardSize) % boardSize;
  newHead.y = (newHead.y + boardSize) % boardSize;

  return [newHead, ...snake.slice(0, -1)];
};

// Se a cabeça da cobra colidir com o corpo, retorna true
const checkCollision = (snake) => {
  const [head, ...body] = snake;
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};

// Apenas gera um objeto com coordenadas aleatórias
function generateCoffee() {
  return {
    x: Math.floor(Math.random() * boardSize),
    y: Math.floor(Math.random() * boardSize),
  };
}

const gameLoop = (state) => {
  if (state.gameOver) {
    document.getElementById("messages").innerText = "Game over!";
    return;
  }

  const newSnake = moveSnake(state.snake, initialState.direction);
  if (checkCollision(newSnake)) {
    state.gameOver = true;
  }

  let novoCoffee = state.coffee;
  let novaPontuacao = state.points;
  if (newSnake[0].x === state.coffee.x && newSnake[0].y === state.coffee.y) {
    newSnake.push({ ...newSnake[newSnake.length - 1] });
    novoCoffee = generateCoffee();
    novaPontuacao += 1;
  }

  const newState = {
    ...state,
    snake: newSnake,
    coffee: novoCoffee,
    points: novaPontuacao,
  };

  desenhaTabuleiro(newState);
  setTimeout(() => gameLoop(newState), 200);
};

const handleKeyPress = (event) => {
  const keyMap = {
    ArrowRight: DIREITA,
    ArrowLeft: ESQUERDA,
    ArrowUp: CIMA,
    ArrowDown: BAIXO,
  };

  if (keyMap[event.key]) {
    initialState.direction = keyMap[event.key];
  }
};

document.addEventListener("keydown", handleKeyPress);
desenhaTabuleiro(initialState);
gameLoop(initialState);
