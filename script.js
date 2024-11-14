const direita = { x: 1, y: 0 };
const esquerda = { x: -1, y: 0 };
const cima = { x: 0, y: -1 };
const baixo = { x: 0, y: 1 };

const tamanho = 20;

const estadoInicial = {
  cobra: [{ x: 0, y: 0 }],
  cafe: generateCoffee(),
  direcao: direita,
  gameOver: false,
};

const tabuleiro = document.getElementById("tabuleiro");

for (let index = 0; index < tamanho * tamanho; index += 1) {
  const casa = document.createElement("div");
  casa.classList.add("casa");
  tabuleiro.appendChild(casa);
}

const desenhaTabuleiro = (estado) => {
  const casas = document.querySelectorAll(".casa");
  casas.forEach((casa) => (casa.className = "casa"));
  const [cabeca, ...cauda] = estado.cobra;
  const index = cabeca.y * tamanho + cabeca.x;
  casas[index].classList.add("snake");
  cauda.forEach((pedaco) => {
    const index = pedaco.y * tamanho + pedaco.x;
    casas[index].classList.add("cauda");
  });

  const coffeeIndex = estado.cafe.y * tamanho + estado.cafe.x;
  casas[coffeeIndex].classList.add("coffee");
};

const moveCobra = (cobra, direcao) => {
  const novaCabeca = {
    x: cobra[0].x + direcao.x,
    y: cobra[0].y + direcao.y,
  };

  novaCabeca.x = (novaCabeca.x + tamanho) % tamanho;
  novaCabeca.y = (novaCabeca.y + tamanho) % tamanho;

  return [novaCabeca, ...cobra.slice(0, -1)];
};

const verificaColisao = (cobra) => {
  const [head, ...body] = cobra;
  return body.some((pedaco) => pedaco.x === head.x && pedaco.y === head.y);
};

function generateCoffee() {
  return {
    x: Math.floor(Math.random() * tamanho),
    y: Math.floor(Math.random() * tamanho),
  };
}

const gameLoop = (estado) => {
  if (estado.gameOver) {
    alert("Game over!");
    return;
  }

  const novaCobra = moveCobra(estado.cobra, estadoInicial.direcao);
  if (verificaColisao(novaCobra)) {
    estado.gameOver = true;
  }

  let novoCafe = estado.cafe;
  if (novaCobra[0].x === estado.cafe.x && novaCobra[0].y === estado.cafe.y) {
    novaCobra.push({ ...novaCobra[novaCobra.length - 1] });
    novoCafe = generateCoffee();
  }

  const novoEstado = {
    ...estado,
    cobra: novaCobra,
    cafe: novoCafe,
  };

  desenhaTabuleiro(novoEstado);
  setTimeout(() => gameLoop(novoEstado), 200);
};

const handleKeyPress = (event) => {
  const keyMap = {
    ArrowRight: { x: 1, y: 0 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
  };

  if (keyMap[event.key]) {
    estadoInicial.direcao = keyMap[event.key];
  }
};

document.addEventListener("keydown", handleKeyPress);
desenhaTabuleiro(estadoInicial);
gameLoop(estadoInicial);
