function init() {
    var finalWinner = sessionStorage.getItem("finalWinner");
    var finalScore = sessionStorage.getItem("finalScore");

    var message =  finalWinner + " הוא המנצח!";
    if (finalWinner == "תיקו")
        message = "תיקו!";
    else  // עדכון טבלת האלופים
        updateLeaderboard(finalWinner, finalScore);
    
    document.getElementById("winner").textContent = message;
    document.getElementById("score").textContent = "עם " + finalScore + " נקודות";



    // הפעלת הקונפטי
    startConfetti();
}

// הפונקציות לסיום המשחק ולהתחלת משחק חדש
function finishGame() {
    sessionStorage.clear();
    window.location.href = "../html/homePage.html";
}
function newGame() {
    sessionStorage.setItem("player1Score", 0);
    sessionStorage.setItem("player2Score", 0);
    window.location.href = "../html/gamePage.html";
}

function viewLeaderboard() {
    window.location.href = "../html/leaderboardPage.html";
}

function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 150;
    const confettiColors = ['#ff0a54', '#ff477e', '#ff85a1', '#fbb1bd', '#f9bec7'];
    const confetti = [];

    function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function Confetti() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 7 + 5;
        this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        this.speed = Math.random() * 3 + 2;
        this.opacity = randomRange(0.5, 1);
        this.rotation = randomRange(0, 2 * Math.PI);
        this.rotationSpeed = randomRange(0.02, 0.05);
    }

    Confetti.prototype.update = function() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas.height) {
            this.y = -this.size;
        }
    };

    Confetti.prototype.draw = function() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.rect(0, 0, this.size, this.size * 0.4);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    };

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach((c) => {
            c.update();
            c.draw();
        });
        requestAnimationFrame(loop);
    }

    for (let i = 0; i < confettiCount; i++) {
        confetti.push(new Confetti());
    }

    loop();
}

function updateLeaderboard(winner, score) {
    const maxEntries = 10;
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push({ winner: winner, score: parseInt(score) });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, maxEntries);

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}
