let X_SIZE = 20; // Mặc định số ô ngang
let Y_SIZE = 20; // Mặc định số ô dọc

const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATION_LENGTH = 5; // Số lượng ô liên tiếp cần để thắng

const board = document.getElementById("board");
const winningMessageElement = document.getElementById("winningMessage");
const winningMessageTextElement = document.querySelector(
  "[data-winning-message-text]"
);
const restartButton = document.getElementById("restartButton");
const startGameButton = document.getElementById("startGameButton");
const toggleThemeButton = document.getElementById("toggleThemeButton");
const gameElement = document.getElementById("game");
const gameOptionsElement = document.getElementById("gameOptions");
const turnAnnouncement = document.getElementById("turnAnnouncement");
let circleTurn;
let player1Name;
let player2Name;

startGameButton.addEventListener("click", () => {
  X_SIZE = parseInt(document.getElementById("boardSizeX").value);
  Y_SIZE = parseInt(document.getElementById("boardSizeY").value);
  player1Name = document.getElementById("player1Name").value || "Người chơi 1";
  player2Name = document.getElementById("player2Name").value || "Người chơi 2";
  if (X_SIZE < 8 || Y_SIZE < 8 || X_SIZE > 30 || Y_SIZE > 30) {
    alert("Số ô ngang và dọc phải từ 8 đến 30.");
    return;
  }
  gameOptionsElement.style.display = "none"; // Ẩn phần nhập liệu
  gameElement.style.display = "block";
  startGame();
});

toggleThemeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function createBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${X_SIZE}, 30px)`;
  board.style.gridTemplateRows = `repeat(${Y_SIZE}, 30px)`;
  for (let i = 0; i < X_SIZE * Y_SIZE; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-cell", "");
    board.appendChild(cell);
  }
}

function startGame() {
  circleTurn = Math.random() < 0.5; // Random người đi trước
  createBoard();
  const cellElements = document.querySelectorAll("[data-cell]");
  cellElements.forEach((cell) => {
    cell.innerText = ""; // Clear text instead of removing classes
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove("show");
  winningMessageElement.style.display = "none"; // Ẩn thông báo chiến thắng và nút chơi lại khi bắt đầu trò chơi mới
  turnAnnouncement.innerText = `${
    circleTurn ? player2Name : player1Name
  } sẽ đi trước!`;
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    turnAnnouncement.innerText = `Lượt của ${
      circleTurn ? player2Name : player1Name
    }`;
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "Hòa!";
  } else {
    winningMessageTextElement.innerText = `${
      circleTurn ? player2Name : player1Name
    } Thắng!`;
  }
  winningMessageElement.classList.add("show");
  winningMessageElement.style.display = "flex"; // Hiển thị thông báo chiến thắng và nút chơi lại khi trò chơi kết thúc
}

function isDraw() {
  const cellElements = document.querySelectorAll("[data-cell]");
  return [...cellElements].every((cell) => {
    return cell.innerText === "X" || cell.innerText === "O";
  });
}

function placeMark(cell, currentClass) {
  cell.innerText = currentClass === X_CLASS ? "X" : "O";
  cell.classList.add(currentClass); // Thêm lớp để đổi màu
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  const cellElements = document.querySelectorAll("[data-cell]");
  const winningCondition = [];

  // Tạo điều kiện thắng theo hàng ngang
  for (let i = 0; i < Y_SIZE; i++) {
    for (let j = 0; j <= X_SIZE - WINNING_COMBINATION_LENGTH; j++) {
      const row = [];
      for (let k = 0; k < WINNING_COMBINATION_LENGTH; k++) {
        row.push(cellElements[i * X_SIZE + j + k]);
      }
      winningCondition.push(row);
    }
  }

  // Tạo điều kiện thắng theo hàng dọc
  for (let i = 0; i < X_SIZE; i++) {
    for (let j = 0; j <= Y_SIZE - WINNING_COMBINATION_LENGTH; j++) {
      const column = [];
      for (let k = 0; k < WINNING_COMBINATION_LENGTH; k++) {
        column.push(cellElements[(j + k) * X_SIZE + i]);
      }
      winningCondition.push(column);
    }
  }

  // Tạo điều kiện thắng theo đường chéo chính
  for (let i = 0; i <= Y_SIZE - WINNING_COMBINATION_LENGTH; i++) {
    for (let j = 0; j <= X_SIZE - WINNING_COMBINATION_LENGTH; j++) {
      const diagonal = [];
      for (let k = 0; k < WINNING_COMBINATION_LENGTH; k++) {
        diagonal.push(cellElements[(i + k) * X_SIZE + j + k]);
      }
      winningCondition.push(diagonal);
    }
  }

  // Tạo điều kiện thắng theo đường chéo phụ
  for (let i = 0; i <= Y_SIZE - WINNING_COMBINATION_LENGTH; i++) {
    for (let j = X_SIZE - 1; j >= WINNING_COMBINATION_LENGTH - 1; j--) {
      const diagonal = [];
      for (let k = 0; k < WINNING_COMBINATION_LENGTH; k++) {
        diagonal.push(cellElements[(i + k) * X_SIZE + j - k]);
      }
      winningCondition.push(diagonal);
    }
  }

  return winningCondition.some((cells) => {
    return cells.every((cell) => {
      return cell.classList.contains(currentClass);
    });
  });
}

restartButton.addEventListener("click", () => {
  gameElement.style.display = "none"; // Ẩn phần bảng chơi
  gameOptionsElement.style.display = "block"; // Hiển thị phần nhập liệu
});
