document.addEventListener("DOMContentLoaded", function() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    const tableBody = document.querySelector("#leaderboard tbody");

    leaderboard.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.winner}</td>
            <td>${entry.score}</td>
        `;
        tableBody.appendChild(row);
    });
});

function goBack() {
    window.location.href = "../html/homePage.html";
}
