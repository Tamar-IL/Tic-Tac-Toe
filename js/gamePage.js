
function Player(name, cursor, cursorSrc, color, score) {
    this.name = name
    this.cursor = cursor
    this.cursorSrc = cursorSrc
    this.color = color
    this.score = score
}

var player1;
var player2;

var currentPlayer;
var currentGame;
var maxGames;

var timerInterval;
var timerCountdown;
var allowToClick;

var gameBoard;

function init(){
    var cursorType = sessionStorage.getItem("cursorType")
    player1 = new Player(sessionStorage.getItem("player1Name"), 
                            `../images/${cursorType}-1.png`, 
                            `../images/${cursorType}-1.svg`, 
                            sessionStorage.getItem("player1Color"), 0);

    player2 = new Player(sessionStorage.getItem("player2Name"), 
                        `../images/${cursorType}-2.png`, 
                        `../images/${cursorType}-2.svg`, 
                        sessionStorage.getItem("player2Color"), 0);
    
    gameBoard = Array(9).fill(null);
    currentPlayer = player2;
    currentGame = 1;
    maxGames = 4;

    timerInterval;
    timerCountdown = 10;
    allowToClick = true;

    //       ----------------------- Cursor img --------------------------
    var content = document.getElementById("content");
    var mouseImage = document.getElementById("mouse-image");

    content.addEventListener("mouseenter", function() {
        mouseImage.style.display = "block";
    });

    content.addEventListener("mouseleave", function() {
        mouseImage.style.display = "none";
    });

    document.addEventListener("mousemove", function(event) {
        if (mouseImage.style.display === "block") {
                if(currentPlayer.name == "מחשב")
                    mouseImage.src = "../images/pc.png"
                else 
                    mouseImage.src = currentPlayer.cursor
                
                mouseImage.style.left = event.pageX + 10 + "px"; 
                mouseImage.style.top = event.pageY + 10 + "px";  
        }
    });
    //       ----------------------------------------------------------

    startGame()
}
function startGame(){
    createGameBoard();
    printScores()
    makeTurn()
}


function createGameBoard() {
    var board = document.getElementById("game-board");
    board.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        var square = document.createElement("div");
        square.classList.add("square");
        square.addEventListener("click", function() {
            handleSquareClick(i);
        });
        board.appendChild(square);
    }
}

function updateStatusPlayers(message) {
    document.getElementById("statusPlayers").textContent = message;
}

function makeTurn (){
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    updateStatusPlayers("תור " + currentPlayer.name);

    if (isComputerTurn()) {
        document.getElementById("timer").textContent = "...";
        setTimeout(makeRandomMove, 1000);
    } else {
        startTimer();
    }
}


function makeMove(index) {
    gameBoard[index] = currentPlayer.name;
    var square = document.querySelectorAll(".square")[index];
    insertImg(square);


    // בדיקה אם יש ניצחון במשחק הנוכחי
    if (checkWinner()) {
        allowToClick = false;
        updateStatusPlayers(currentPlayer.name + " ניצח!");
        document.getElementById("winSound").play();
        currentPlayer.score += 25;
        printScores();
    }
    // אם אין נצחון אבל הלוח מלא
    else if (!gameBoard.includes(null)) {
        updateStatusPlayers("תיקו!");
    }
    else {
        return true;
    }

    // אם כבר נגמר מכסת המשחקים
    if (currentGame >= maxGames) {
        setTimeout(displayFinalWinner, 3000);
    } else {
        setTimeout(resetGame, 3000);
    }
    return false;
}

function insertImg(container) {

    // טעינת התמונה
    fetch(currentPlayer.cursorSrc)
        .then(response => response.text())
        .then(svgText => {
            container.innerHTML = svgText;
            const svgElement = container.querySelector('svg');

            svgElement.style.width = '50%';
            svgElement.style.height = '50%';
            
            // קביעת הצבע
            const paths = svgElement.querySelectorAll('path');
            paths.forEach(path => {
                path.style.setProperty('fill', currentPlayer.color, 'important');
            });
        });
}


function handleSquareClick(index) {
    if (gameBoard[index] || isComputerTurn() || !allowToClick) {
        return;
    }
    resetTimer();
    var r =  makeMove(index);
    if (r) {
        allowToClick = false;
        setTimeout(function(){         
            allowToClick = true;
            makeTurn()
        }, 500);
    }
}

function isComputerTurn() {
    return (currentPlayer.name === "מחשב");
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            highlightWinningSquares(combination);
            return true;
        }
    }
    return false;
}

function highlightWinningSquares(combination) {
    for (const index of combination) {
        document.querySelectorAll(".square")[index].classList.add("winning-square");
    }
}

function printScores() {
    document.getElementById("score").innerHTML = 
        `<span class="player-name">${player1.name} : </span> ${player1.score} נקודות
        <br>
        <span class="player-name">${player2.name} : </span> ${player2.score} נקודות`
    ;
}


function resetGame() {
    resetTimer()

    gameBoard = Array(9).fill(null);
    createGameBoard();

    currentGame++;
    document.getElementById("statusGame").innerText = `${currentGame} מתוך 4`

    currentPlayer = currentGame%2 == 0 ? player1 : player2;

    allowToClick = true
    makeTurn()
}

function displayFinalWinner() {
    if (player1.score > player2.score) {
        sessionStorage.setItem("finalWinner", player1.name);
        sessionStorage.setItem("finalScore", player1.score);
    } else if (player1.score < player2.score) {
        sessionStorage.setItem("finalWinner", player2.name);
        sessionStorage.setItem("finalScore", player2.score);
    } else {
        sessionStorage.setItem("finalWinner", "תיקו");
        sessionStorage.setItem("finalScore", player1.score);
    }
    window.location.href = "../html/winnerPage.html";
}


function resetTimer() {
    clearInterval(timerInterval);
}
function startTimer() {
    resetTimer();

    timerCountdown = 10;
    document.getElementById("timer").textContent = timerCountdown;
    document.getElementById("timer").classList.remove("red");
    timerInterval = setInterval(function() {
        timerCountdown--;
        document.getElementById("timer").textContent = timerCountdown;
        if (timerCountdown <= 5) {
            document.getElementById("timer").classList.add("red");
        }
        if (timerCountdown === 0) {
            resetTimer()
            makeRandomMove();
        }
    }, 1000);
}

function makeRandomMove() {
    let availableMoves = gameBoard.map((value, index) => value === null ? index : null).filter(val => val !== null);
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    var r = makeMove(move);
    
    if (r) {
        allowToClick = false;
        setTimeout(function(){         
            allowToClick = true;
            makeTurn()
        }, 500);
    }
}

function endGame() {
    clearInterval(timerInterval)
    displayFinalWinner()
}
