function nextPage(mode) {
    sessionStorage.setItem('gameMode', mode);
    window.location.href = "../html/loginPage.html";
}
function viewLeaderboard() {
    window.location.href = "../html/leaderboardPage.html";
}