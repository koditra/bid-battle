let players = [
    { money: 100, items: [] },
    { money: 100, items: [] }
];
let items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9", "Item 10"];
let currentPlayer = 0;
let highestBidder = null;
let currentBid = 1;
let currentItemIndex = 0;
let gameStarted = true;

const bidInput = document.getElementById("bidInput");
const bidButton = document.getElementById("bidButton");
const passButton = document.getElementById("passButton");

function showStatus(message) {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.innerText = message;
}

function getCurrentItem() {
    return items[currentItemIndex];
}

function finishPlayer(playerIndex) {
    showStatus(`Player ${playerIndex + 1} has filled their inventory!`);
    endGame();
}

function endGame() {
    gameStarted = false;
    showStatus("Game Over!");
    updateButtons();
}

function updateUI() {
    if (document.getElementById("currentPlayerDisplay")) {
        document.getElementById("currentPlayerDisplay").innerText = `Player ${currentPlayer + 1}'s Turn`;
    }
    if (document.getElementById("currentItemDisplay")) {
        document.getElementById("currentItemDisplay").innerText = getCurrentItem();
    }
    if (document.getElementById("player1Money")) {
        document.getElementById("player1Money").innerText = players[0].money;
        document.getElementById("player1Items").innerText = players[0].items.join(", ");
    }
    if (document.getElementById("player2Money")) {
        document.getElementById("player2Money").innerText = players[1].money;
        document.getElementById("player2Items").innerText = players[1].items.join(", ");
    }
    updateButtons();
}

function placeBid(bid) {
    currentBid = bid;
    highestBidder = currentPlayer;
    const nextPlayer = currentPlayer === 0 ? 1 : 0;
    
    if (players[nextPlayer].money > 0) {
        currentPlayer = nextPlayer;
    }
    
    bidInput.value = "";
    updateUI();
}

function pass() {
    const otherPlayerIndex = currentPlayer === 0 ? 1 : 0;
    const otherPlayer = players[otherPlayerIndex];
    const player = players[currentPlayer];

    if (highestBidder === null) {
        const item = getCurrentItem();

        if (otherPlayer.money === 0 || otherPlayer.items.length >= 5) {
            if (otherPlayer.items.length >= 5) {
                showStatus(`Player ${otherPlayerIndex + 1}'s inventory is full. Player ${currentPlayer + 1} must take or bid on the item.`);
                return;
            }

            otherPlayer.items.push(item);
            currentItemIndex++;

            showStatus(`Player ${currentPlayer + 1} passed. ${item} went to Player ${otherPlayerIndex + 1} for $0.`);

            if (currentItemIndex >= items.length) {
                endGame();
                return;
            }

            currentBid = 1;
            highestBidder = null;
            bidInput.value = "";
            
            if (otherPlayer.items.length === 5) {
                finishPlayer(otherPlayerIndex);
                return;
            }

            updateUI();
            return;
        }

        showStatus("You can't pass yet. Someone must bid $1 first.");
        return;
    }

    const winnerIndex = highestBidder;
    const winner = players[winnerIndex];
    const item = getCurrentItem();

    if (winner.items.length >= 5) {
        showStatus("That player already has 5 items.");
        return;
    }

    if (winner.money < currentBid) {
        showStatus("The winner can't afford this item.");
        return;
    }

    winner.money -= currentBid;
    winner.items.push(item);
    currentItemIndex++;

    showStatus(`Player ${winnerIndex + 1} won ${item} for $${currentBid}.`);

    if (currentItemIndex >= items.length) {
        endGame();
        return;
    }

    if (winner.items.length === 5) {
        finishPlayer(winnerIndex);
        return;
    }

    currentBid = 1;
    highestBidder = null;

    const nextPlayerIndex = winnerIndex === 0 ? 1 : 0;
    currentPlayer = players[nextPlayerIndex].money > 0 ? nextPlayerIndex : winnerIndex;

    bidInput.value = "";
    updateUI();
}

function updateButtons() {
    const player = players[currentPlayer];
    const otherPlayer = players[currentPlayer === 0 ? 1 : 0];

    if (!gameStarted) {
        if (bidButton) bidButton.disabled = true;
        if (passButton) passButton.disabled = true;
        if (bidInput) bidInput.disabled = true;
        return;
    }

    if (player.items.length >= 5) {
        if (bidButton) bidButton.disabled = true;
        if (passButton) passButton.disabled = true;
        if (bidInput) bidInput.disabled = true;
        return;
    }

    if (bidInput) bidInput.disabled = player.money < 1;
    if (bidButton) bidButton.disabled = player.money < 1;

    if (highestBidder === null) {
        if (bidInput) bidInput.min = 1;
        if (passButton) passButton.disabled = !(otherPlayer.money === 0 || otherPlayer.items.length >= 5);
    } else {
        if (bidInput) bidInput.min = currentBid + 1;
        if (passButton) passButton.disabled = false;
    }
}
