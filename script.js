let X_SIZE = 8; // Mặc định số ô ngang
      let Y_SIZE = 8; // Mặc định số ô dọc

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

      let circleTurn;
      let player1Name;
      let player2Name;
      let currentLanguage = "en"; // Mặc định ngôn ngữ là tiếng Anh

      const nameAlertMessage = {
        vi: "Vui lòng nhập tên cả hai người chơi.",
        en: "Please enter names for both players.",
        ja: "両方のプレイヤーの名前を入力してください。",
      };

      const turnAnnouncementMessage = {
        vi: "tới lượt",
        en: "'s turn!",
        ja: "の番です！",
      };

      const winningMessageText = {
        vi: {
          draw: "Hòa!",
          win: "Thắng!",
        },
        en: {
          draw: "Draw!",
          win: "Wins!",
        },
        ja: {
          draw: "引き分け！",
          win: "勝ちました！",
        },
      };
      startGameButton.addEventListener("click", () => {
        X_SIZE = parseInt(document.getElementById("boardSizeX").value);
        Y_SIZE = parseInt(document.getElementById("boardSizeY").value);
        player1Name = document.getElementById("player1Name").value.trim();
        player2Name = document.getElementById("player2Name").value.trim();

        // Kiểm tra xem người chơi đã nhập tên chưa
        if (!player1Name || !player2Name) {
          document.getElementById("nameAlertMessage").textContent =
            nameAlertMessage[currentLanguage]; // Hiển thị thông điệp cảnh báo cho ngôn ngữ hiện tại
          document.getElementById("nameAlert").style.display = "block"; // Hiển thị cảnh báo
          return;
        } else {
          document.getElementById("nameAlert").style.display = "none"; // Ẩn cảnh báo nếu đã nhập đủ tên
        }

        if (X_SIZE < 8 || Y_SIZE < 8 || X_SIZE > 30 || Y_SIZE > 30) {
          document.getElementById("alertMessage").textContent =
            alertMessage[currentLanguage];
          document.getElementById("Alert").style.display = "block";
          return;
        } else {
          document.getElementById("Alert").style.display = "none";
        }
        gameOptionsElement.style.display = "none"; // Ẩn phần nhập liệu
        gameElement.style.display = "block";
        startGame();
      });

      toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark");
      });

      const toggleLanguageButton = document.getElementById(
        "toggleLanguageButton"
      );

      toggleLanguageButton.addEventListener("click", () => {
        // Toggle language logic
        const currentLanguage = document.documentElement.lang;

        switch (currentLanguage) {
          case "en":
            switchToJapanese();
            break;
          case "ja":
            switchToVietnamese();
            break;
          case "vi":
            switchToEnglish();
            break;
          default:
            switchToEnglish(); // Default to English if language is undefined
            break;
        }
      });

      // Chuyển sang tiếng Nhật
      function switchToJapanese() {
        document.documentElement.lang = "ja";
        document.title = "五目並べ";

        document.getElementById("startGameButton").innerText = "ゲームを始める";
        document.getElementById("toggleThemeButton").innerText =
          "テーマの切り替え";
        document.getElementById("toggleLanguageButton").innerText =
          "言語を切り替える";
        document.getElementById("gameOptions").querySelector("h2").innerText =
          "ゲーム設定";
        document.getElementById("boardSizeX").previousElementSibling.innerText =
          "横のマス数（8-30）:";
        document.getElementById("boardSizeY").previousElementSibling.innerText =
          "縦のマス数（8-30）:";
        document.getElementById(
          "player1Name"
        ).previousElementSibling.innerText = "プレーヤー1の名前（X）:";
        document.getElementById(
          "player2Name"
        ).previousElementSibling.innerText = "プレーヤー2の名前（O）:";
        document.getElementById("restartButton").innerText = "再開";
        document.getElementById("turnAnnouncement").innerText = `${
          circleTurn ? player2Name : player1Name
        } が先に行きます!`;
        document.querySelector("[data-winning-message-text]").innerText =
          "引き分け！";

        currentLanguage = "ja";
        updateTurnAnnouncement();
      }

      // Chuyển sang tiếng Việt
      function switchToVietnamese() {
        document.documentElement.lang = "vi";
        document.title = "Cờ Caro";
        document.getElementById("startGameButton").innerText =
          "Bắt đầu trò chơi";
        document.getElementById("toggleThemeButton").innerText =
          "Chuyển đổi nền";
        document.getElementById("toggleLanguageButton").innerText =
          "Chuyển đổi ngôn ngữ";
        document.getElementById("gameOptions").querySelector("h2").innerText =
          "Cài đặt trò chơi";
        document.getElementById("boardSizeX").previousElementSibling.innerText =
          "Số ô ngang (8-30):";
        document.getElementById("boardSizeY").previousElementSibling.innerText =
          "Số ô dọc (8-30):";
        document.getElementById(
          "player1Name"
        ).previousElementSibling.innerText = "Tên người chơi 1 (X):";
        document.getElementById(
          "player2Name"
        ).previousElementSibling.innerText = "Tên người chơi 2 (O):";
        document.getElementById("restartButton").innerText = "Chơi lại";
        document.getElementById("turnAnnouncement").innerText = `${
          circleTurn ? player2Name : player1Name
        } sẽ đi trước!`;
        document.querySelector("[data-winning-message-text]").innerText =
          "Hòa!";

        currentLanguage = "vi";
        updateTurnAnnouncement();
      }

      // Chuyển sang tiếng Anh
      function switchToEnglish() {
        document.documentElement.lang = "en";
        document.title = "Caro Game";
        document.getElementById("startGameButton").innerText = "Start Game";
        document.getElementById("toggleThemeButton").innerText = "Toggle Theme";
        document.getElementById("toggleLanguageButton").innerText =
          "Switch Language";
        document.getElementById("gameOptions").querySelector("h2").innerText =
          "Game Setup";
        document.getElementById("boardSizeX").previousElementSibling.innerText =
          "Board Size X (8-30):";
        document.getElementById("boardSizeY").previousElementSibling.innerText =
          "Board Size Y (8-30):";
        document.getElementById(
          "player1Name"
        ).previousElementSibling.innerText = "Player 1 Name (X):";
        document.getElementById(
          "player2Name"
        ).previousElementSibling.innerText = "Player 2 Name (O):";
        document.getElementById("restartButton").innerText = "Restart";
        document.getElementById("turnAnnouncement").innerText = `${
          circleTurn ? player2Name : player1Name
        } will go first`;

        currentLanguage = "en";
        updateTurnAnnouncement();
      }

      function updateTurnAnnouncement() {
        turnAnnouncement.innerText = `${
          circleTurn ? player2Name : player1Name
        } ${turnAnnouncementMessage[currentLanguage]}`;
      }

      let alertMessage = {
        vi: "Số ô ngang và dọc phải từ 8 đến 30.",
        en: "Board size must be between 8 and 30.",
        ja: "横と縦のマスは8から30までの数字でなければなりません。",
      };

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
        updateTurnAnnouncement(); // Gọi hàm để thông báo ai sẽ đi trước
      }

      const turnAnnouncement = document.createElement("div");
      turnAnnouncement.classList.add("turn-announcement");
      document.body.appendChild(turnAnnouncement);

      // Cập nhật thông báo về người chơi nào sẽ đi trước và lượt của người chơi hiện tại
      function updateTurnAnnouncement() {
        const turnAnnouncementElement =
          document.getElementById("turnAnnouncement");
        turnAnnouncementElement.innerText = `${
          circleTurn ? player2Name : player1Name
        } ${turnAnnouncementMessage[currentLanguage]}`;
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
          updateTurnAnnouncement();
        }
      }

      function endGame(draw) {
        if (draw) {
          winningMessageTextElement.innerText =
            winningMessageText[currentLanguage].draw;
        } else {
          winningMessageTextElement.innerText = `${
            circleTurn ? player2Name : player1Name
          } ${winningMessageText[currentLanguage].win}`;
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
