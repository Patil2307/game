const emojis = ['😀', '😂', '😎', '🥳', '🤩', '😱', '😭', '😈'];
let cards = [...emojis, ...emojis]; // Duplicate for pairs
let turnedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let interval;
let playerName = "";
let gameBoard = document.getElementById("gameBoard");

function toggleStartButton() {
    const playerName = document.getElementById("playerName").value.trim();
    document.getElementById("startButton").disabled = playerName === "";
}

// Function to shuffle the cards
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Start the game
function startGame() {
    playerName = document.getElementById("playerName").value.trim();
    
    if (playerName === "") {
        alert("Please enter your name to start the game.");
        return;
    }

    cards = shuffle([...emojis, ...emojis]); // Ensures 16 cards
    gameBoard.innerHTML = ""; // Clear previous board

    cards.forEach((emoji, index) => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.addEventListener("click", turnCard);
        gameBoard.appendChild(card);
    });

    // Reset game variables
    turnedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    document.getElementById("moves").textContent = moves;
    document.getElementById("time").textContent = timer + "s";

    // Start Timer
    clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        document.getElementById("time").textContent = timer + "s";
    }, 1000);
}

// Flip a card
function turnCard() {
    if (turnedCards.length < 2 && !this.classList.contains("turned")) {
        this.classList.add("turned");

        // Ensure emoji is immediately visible
        setTimeout(() => {
            this.textContent = this.dataset.emoji;
        }, 200); 

        turnedCards.push(this);

        if (turnedCards.length === 2) {
            moves++;
            document.getElementById("moves").textContent = moves;
            setTimeout(checkMatch, 8);
        }
    }
}


// Check if two turned cards match
function checkMatch() {
    if (turnedCards.length !== 2) return;

    const [card1, card2] = turnedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Matched pair: Keep emoji visible
        matchedPairs++;
        turnedCards = [];

        if (matchedPairs === emojis.length) {
            clearInterval(interval);
            setTimeout(() => {
                alert(`🎉 ${playerName}, you won in ${moves} moves and ${timer} seconds!`);
                saveScore(playerName, moves, timer);
            }, 500);
        }
    } else {
        // Unmatched pair: Flip back
        setTimeout(() => {
            card1.classList.remove("turned");
            card2.classList.remove("turned");

            // Hide the emoji only after flipping back
            card1.textContent = ""; 
            card2.textContent = ""; 

            turnedCards = [];
        }, 1000); // Give time before flipping back
    }
}


// Save the score in local storage
function saveScore(name, moves, time) {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    scores.push({ name, moves, time });

    // Sort by best score (fewer moves, then less time)
    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);

    // Store only the top 5 scores
    localStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 5)));

    updateLeaderboard();
}

// Update leaderboard display
function updateLeaderboard() {
    let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let leaderboardTable = document.getElementById("leaderboard");

    // Clear previous rows except headers
    leaderboardTable.innerHTML = `
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Moves</th>
            <th>Time</th>
        </tr>
    `;

    scores.forEach((score, index) => {
        let row = leaderboardTable.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${score.name}</td>
            <td>${score.moves}</td>
            <td>${score.time}s</td>
        `;
    });
}

// Restart the game
function restartGame() {
    startGame();
}

// Load leaderboard when the page opens
window.onload = updateLeaderboard;
