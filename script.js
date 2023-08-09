// script.js
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameOver = false;
let selectedMode = "easy";

function setMode(mode) {
    selectedMode = mode;
    resetGame();
}

function displayPlayerTurn() {
    const turnMessage = document.getElementById("turn-message");
    turnMessage.innerText = "Player " + currentPlayer + "'s Turn";
}

function displayResultMessage(message) {
    const resultMessage = document.getElementById("result-message");
    resultMessage.innerText = message;
}

function makeMove(index) {
    if (!gameOver && board[index] === "") {
        board[index] = currentPlayer;
        document.getElementById("board").children[index].innerText = currentPlayer;

        if (checkWin(currentPlayer)) {
            gameOver = true;
            displayResultMessage(currentPlayer + " wins!");
            setTimeout(resetGame, 500); // Reset the game after 0.5 seconds
        } else if (isDraw()) {
            gameOver = true;
            displayResultMessage("It's a draw!");
            setTimeout(resetGame, 500); // Reset the game after 0.5 seconds
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            displayPlayerTurn(); // Display the current player's turn
            if (currentPlayer === "O") {
                setTimeout(makeBotMove, 500); // Bot makes a move after a delay (0.5 seconds)
            }
        }
    }
}

function checkWin(player) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

function isDraw() {
    return board.every(cell => cell !== "");
}

function makeBotMove() {
    if (!gameOver) {

        if (currentPlayer === "O") {
            if (selectedMode === "easy") {
                makeBotMoveEasy();
            } else if (selectedMode === "medium") {
                makeBotMoveMedium();
            } else if (selectedMode === "hard") {
                makeBotMoveHard();
            }
        }
    }
}

function makeBotMoveEasy() {
    const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    }
}


function makeBotMoveMedium() {
    if (!gameOver) {
        const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);

        const chanceOfSuboptimalMove = 0.5;

        const makeSuboptimalMove = Math.random() < chanceOfSuboptimalMove;

        let bestMoveIndices = [];
        let bestScore = -Infinity;

        for (let i = 0; i < emptyCells.length; i++) {
            // Try making the move for the bot
            board[emptyCells[i]] = "O";

            // Evaluate the score for the move using Minimax
            const score = makeSuboptimalMove ? Math.random() : minimax("X", 0, -Infinity, Infinity).score;

            // Undo the move
            board[emptyCells[i]] = "";

            // Check if this move gives a better score than the current best
            if (score > bestScore) {
                bestScore = score;
                bestMoveIndices = [emptyCells[i]];
            } else if (score === bestScore) {
                // Add the move to the bestMoveIndices if it has the same score as the current best
                bestMoveIndices.push(emptyCells[i]);
            }
        }

        // Randomly select a move from the bestMoveIndices array
        const randomIndex = Math.floor(Math.random() * bestMoveIndices.length);
        const bestMoveIndex = bestMoveIndices[randomIndex];

        // Make the best move found
        makeMove(bestMoveIndex);
    }
}



function makeBotMoveHard() {
    if (!gameOver) {
        const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);

        let bestMoveIndices = [];
        let bestScore = -Infinity;

        for (let i = 0; i < emptyCells.length; i++) {
            // Try making the move for the bot
            board[emptyCells[i]] = "O";

            // Evaluate the score for the move
            const score = minimax("X", 0, -Infinity, Infinity).score;

            // Undo the move
            board[emptyCells[i]] = "";

            // Check if this move gives a better score than the current best
            if (score > bestScore) {
                bestScore = score;
                bestMoveIndices = [emptyCells[i]];
            } else if (score === bestScore) {
                // Add the move to the bestMoveIndices if it has the same score as the current best
                bestMoveIndices.push(emptyCells[i]);
            }
        }

        // Randomly select a move from the bestMoveIndices array
        const randomIndex = Math.floor(Math.random() * bestMoveIndices.length);
        const bestMoveIndex = bestMoveIndices[randomIndex];

        // Make the best move found
        makeMove(bestMoveIndex);
    }
}

function minimax(player, depth, alpha, beta) {
    if (checkWin("O")) {
        return { score: 10 - depth };
    } else if (checkWin("X")) {
        return { score: depth - 10 };
    } else if (isDraw()) {
        return { score: 0 };
    }

    const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    const moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        const move = {};
        move.index = emptyCells[i];
        board[emptyCells[i]] = player;

        if (player === "O") {
            const result = minimax("X", depth + 1, alpha, beta);
            move.score = result.score;
            alpha = Math.max(alpha, result.score);
        } else {
            const result = minimax("O", depth + 1, alpha, beta);
            move.score = result.score;
            beta = Math.min(beta, result.score);
        }

        board[emptyCells[i]] = "";
        moves.push(move);

        if (beta <= alpha) {
            break; 
        }
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
        return moves[bestMove];
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
        return moves[bestMove];
    }
}


function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
    }
    displayPlayerTurn(); 
    displayResultMessage(""); 
}

// Event listener for mode selection
document.querySelectorAll('input[type="radio"][name="mode"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        setMode(this.value); 
    });
});

document.getElementById("start-game-btn").addEventListener("click", function () {
    startGame();
});

function startGame() {
    const cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
    }

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    displayPlayerTurn();
    displayResultMessage("");

    if (currentPlayer === "O") {
        // Start the game with bot's move after a delay
        setTimeout(makeBotMove, 500);
    }
}
