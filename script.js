import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";

let player1 = {
    money: 20,
    items: []
};

let player2 = {
    money: 20,
    items: []
};

const players = [player1, player2];

let currentPlayer = 0;
let currentItemIndex = 0;
let currentBid = 1;
let highestBidder = null;
let items = [];
let gameStarted = false;

let engine = null;
let aiReady = false;

const MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const themeElement = document.getElementById("theme");
const currentItemElement = document.getElementById("current-item");
const currentBidElement = document.getElementById("current-bid");
const highestBidderElement = document.getElementById("highest-bidder");
const turnElement = document.getElementById("turn");

const bidInput = document.getElementById("bid-input");
const bidButton = document.getElementById("bid-button");
const passButton = document.getElementById("pass-button");

const money1Element = document.getElementById("money1");
const money2Element = document.getElementById("money2");

const count1Element = document.getElementById("count1");
const count2Element = document.getElementById("count2");

const itemsRemainingElement =
    document.getElementById("items-remaining");

const itemsAuctionedElement =
    document.getElementById("items-auctioned");

const statusElement =
    document.getElementById("auction-status");

const newGameButton =
    document.getElementById("new-game-button");

const loadingScreen =
    document.getElementById("ai-loading");

const loadingText =
    document.getElementById("ai-loading-text");

const progressBar =
    document.getElementById("ai-progress");

const percentText =
    document.getElementById("ai-percent");

const modeScreen =
    document.getElementById("game-mode-screen");

const aiModeButton =
    document.getElementById("ai-mode-button");

const premadeModeButton =
    document.getElementById("premade-mode-button");

const gameElement =
    document.getElementById("game");

const premadeGames = [
    {
        theme: "Build Your Own Theme Park",
        items: [
            "Roller Coaster",
            "Ferris Wheel",
            "Water Ride",
            "Arcade",
            "Haunted House",
            "Food Court",
            "Go-Kart Track",
            "Carousel",
            "Laser Tag Arena",
            "Fireworks Show"
        ]
    },
    {
        theme: "Build Your Own Space Station",
        items: [
            "Command Center",
            "Solar Panels",
            "Robot Arm",
            "Sleeping Pods",
            "Greenhouse",
            "Research Lab",
            "Docking Bay",
            "Defense Shield",
            "Observation Deck",
            "Moon Rover"
        ]
    },
    {
        theme: "Build Your Own Pirate Ship",
        items: [
            "Treasure Room",
            "Cannon Deck",
            "Captain's Cabin",
            "Crow's Nest",
            "Sail Set",
            "Secret Hatch",
            "Ship Wheel",
            "Giant Anchor",
            "Prison Cell",
            "Parrot"
        ]
    },
    {
        theme: "Build Your Own Arcade",
        items: [
            "Racing Cabinet",
            "Claw Machine",
            "Dance Machine",
            "Pinball Machine",
            "Prize Counter",
            "Rhythm Game",
            "VR Station",
            "Skee-Ball Lane",
            "Photo Booth",
            "Boss Battle Game"
        ]
    },
    {
        theme: "Build Your Own Robot",
        items: [
            "Laser Eyes",
            "Jet Boots",
            "Robot Arm",
            "AI Brain",
            "Shield Generator",
            "Grappling Hook",
            "Rocket Pack",
            "X-Ray Vision",
            "Energy Core",
            "Voice Modulator"
        ]
    },
    {
        theme: "Build Your Own Castle",
        items: [
            "Drawbridge",
            "Throne Room",
            "Watchtower",
            "Secret Tunnel",
            "Dungeon",
            "Armory",
            "Ballroom",
            "Moat",
            "Great Hall",
            "Treasure Vault"
        ]
    },
    {
        theme: "Build Your Own Treehouse",
        items: [
            "Rope Bridge",
            "Zipline",
            "Secret Door",
            "Lookout Deck",
            "Ladder",
            "Swing",
            "Sleeping Loft",
            "Snack Room",
            "Trapdoor",
            "Hidden Safe"
        ]
    },
    {
        theme: "Build Your Own Underwater Base",
        items: [
            "Glass Dome",
            "Submarine Dock",
            "Research Lab",
            "Aquarium",
            "Airlock",
            "Sonar Room",
            "Robot Sub",
            "Sleeping Quarters",
            "Control Room",
            "Pressure Shield"
        ]
    },
    {
        theme: "Build Your Own Racing Team",
        items: [
            "Race Car",
            "Pit Crew",
            "Garage",
            "Racing Simulator",
            "Tire Set",
            "Engine Upgrade",
            "Team Uniform",
            "Pit Wall",
            "Transport Truck",
            "Trophy"
        ]
    },
    {
        theme: "Build Your Own Wizard Tower",
        items: [
            "Spell Library",
            "Magic Lab",
            "Dragon Roost",
            "Potion Room",
            "Teleport Pad",
            "Crystal Ball",
            "Secret Staircase",
            "Magic Garden",
            "Training Room",
            "Spell Forge"
        ]
    },
    {
        theme: "Build Your Own Video Game",
        items: [
            "Main Character",
            "Final Boss",
            "Open World",
            "Secret Level",
            "Skill Tree",
            "Boss Arena",
            "Inventory System",
            "Fast Travel",
            "Multiplayer Mode",
            "Easter Egg"
        ]
    },
    {
        theme: "Build Your Own Futuristic City",
        items: [
            "Flying Cars",
            "Skybridge",
            "Robot Workers",
            "Mega Tower",
            "Transit Hub",
            "Solar Road",
            "Drone Port",
            "AI Assistant",
            "Energy Grid",
            "Hologram Plaza"
        ]
    }
];

function setProgress(value, text) {
    const percent = Math.max(
        0,
        Math.min(100, Math.round(value))
    );

    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }

    if (percentText) {
        percentText.textContent = `${percent}%`;
    }

    if (text && loadingText) {
        loadingText.textContent = text;
    }
}

async function loadAI() {
    try {
        setProgress(5, "checking webgpu...");

        if (!navigator.gpu) {
            throw new Error(
                "WebGPU is not supported in this browser."
            );
        }

        const adapter =
            await navigator.gpu.requestAdapter();

        if (!adapter) {
            throw new Error(
                "no compatible gpu was found."
            );
        }

        setProgress(
            10,
            "starting local ai..."
        );

        engine = await CreateMLCEngine(
            MODEL,
            {
                initProgressCallback: progress => {
                    if (
                        progress &&
                        typeof progress.progress ===
                            "number"
                    ) {
                        const value =
                            10 +
                            progress.progress * 85;

                        setProgress(
                            value,
                            progress.text ||
                                "downloading local ai..."
                        );
                    }
                }
            }
        );

        aiReady = true;

        setProgress(
            100,
            "local ai ready!"
        );

        await new Promise(resolve =>
            setTimeout(resolve, 600)
        );

        loadingScreen.style.display = "none";
        gameElement.style.display = "block";

        await startGame("ai");

    } catch (error) {
        console.error(error);

        aiReady = false;

        setProgress(
            100,
            "using premade games..."
        );

        await new Promise(resolve =>
            setTimeout(resolve, 600)
        );

        loadingScreen.style.display = "none";
        gameElement.style.display = "block";

        await startGame("premade");
    }
}

function cleanAIText(text) {
    if (!text) {
        return "";
    }

    return text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
}

function extractJSON(text) {
    const cleaned = cleanAIText(text);

    const start = cleaned.indexOf("{");

    if (start === -1) {
        return null;
    }

    let depth = 0;
    let inString = false;
    let escaped = false;

    for (
        let i = start;
        i < cleaned.length;
        i++
    ) {
        const char = cleaned[i];

        if (escaped) {
            escaped = false;
            continue;
        }

        if (char === "\\") {
            escaped = true;
            continue;
        }

        if (char === '"') {
            inString = !inString;
            continue;
        }

        if (inString) {
            continue;
        }

        if (char === "{") {
            depth++;
        }

        if (char === "}") {
            depth--;

            if (depth === 0) {
                return cleaned.slice(
                    start,
                    i + 1
                );
            }
        }
    }

    return null;
}

function cleanGeneratedItems(items) {
    if (!Array.isArray(items)) {
        return [];
    }

    return items
        .map(item =>
            String(item)
                .replace(/^[-*•]\s*/, "")
                .replace(/^\d+[\).\s]+/, "")
                .trim()
        )
        .filter(item => item.length > 0)
        .slice(0, 10);
}

async function generateGame() {
    if (!engine || !aiReady) {
        return null;
    }

    showStatus(
        "creating a new game..."
    );

    const prompt = `
You are generating content for a fun two-player bidding game.

Create ONE unusual and specific thing that players can build.

Avoid these themes:
- cars
- supercars
- supervillain bases
- superhero bases
- castles
- theme parks
- space stations
- wizard towers
- treehouses
- futuristic cities
- pirate ships
- video games
- robots

The theme should be something creative like:
Build Your Own Arctic Research Camp
Build Your Own Monster Museum
Build Your Own Underground Train Station
Build Your Own Dinosaur Park
Build Your Own Floating Island
Build Your Own Spy School

Then create exactly 10 items that are important parts, rooms, upgrades, characters, tools, or features of that exact theme.

Every item MUST make sense for the theme.

Do not make random items.

Do not repeat items.

Do not use generic items unless they clearly belong to the theme.

Return ONLY valid JSON.

{
  "theme": "Build Your Own ...",
  "items": [
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "...",
    "..."
  ]
}
`;

    try {
        const response =
            await engine.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 1.3,
                max_tokens: 500
            });

        const text =
            response?.choices?.[0]?.message?.content ||
            "";

        console.log(
            "AI response:",
            text
        );

        const jsonText =
            extractJSON(text);

        if (!jsonText) {
            return null;
        }

        let result;

        try {
            result =
                JSON.parse(jsonText);
        } catch {
            return null;
        }

        if (
            typeof result.theme !==
            "string"
        ) {
            return null;
        }

        const cleanItems =
            cleanGeneratedItems(
                result.items
            );

        if (
            cleanItems.length !== 10
        ) {
            return null;
        }

        return {
            theme:
                result.theme.trim(),
            items:
                cleanItems
        };

    } catch (error) {
        console.error(
            "AI generation error:",
            error
        );

        return null;
    }
}

function getPremadeGame() {
    const randomIndex =
        Math.floor(
            Math.random() *
            premadeGames.length
        );

    const game =
        premadeGames[randomIndex];

    return {
        theme: game.theme,
        items: [...game.items]
    };
}

function getCurrentItem() {
    return items[currentItemIndex];
}

function placeBid(bid) {
    const player =
        players[currentPlayer];

    if (
        !Number.isInteger(bid) ||
        bid < 1
    ) {
        showStatus(
            "the minimum bid is $1."
        );

        return;
    }

    if (
        highestBidder !== null &&
        bid <= currentBid
    ) {
        showStatus(
            `your bid must be higher than $${currentBid}.`
        );

        return;
    }

    if (bid > player.money) {
        showStatus(
            "you don't have enough money."
        );

        return;
    }

    if (
        player.items.length >= 5
    ) {
        showStatus(
            "you already have 5 items."
        );

        return;
    }

    currentBid = bid;
    highestBidder = currentPlayer;

    currentPlayer =
        currentPlayer === 0
            ? 1
            : 0;

    bidInput.value = "";

    showStatus(
        `player ${highestBidder + 1} bid $${currentBid}.`
    );

    updateUI();
}

function pass() {
    const otherPlayerIndex =
        currentPlayer === 0 ? 1 : 0;

    const otherPlayer =
        players[otherPlayerIndex];

    if (
        highestBidder === null &&
        otherPlayer.money === 0
    ) {
        const item =
            getCurrentItem();

        otherPlayer.items.push(item);

        currentItemIndex++;

        showStatus(
            `player ${currentPlayer + 1} passed. ${item} went to player ${otherPlayerIndex + 1} for $0.`
        );

        if (
            currentItemIndex >=
            items.length
        ) {
            endGame();
            return;
        }

        currentBid = 1;
        highestBidder = null;

        currentPlayer =
            currentPlayer === 0
                ? 1
                : 0;

        bidInput.value = "";

        updateUI();

        return;
    }

    if (
        highestBidder === null
    ) {
        showStatus(
            "you can't pass yet. someone must bid $1 first."
        );

        return;
    }

    const winnerIndex =
        highestBidder;

    const winner =
        players[winnerIndex];

    const item =
        getCurrentItem();

    if (
        winner.items.length >= 5
    ) {
        showStatus(
            "that player already has 5 items."
        );

        return;
    }

    if (
        winner.money < currentBid
    ) {
        showStatus(
            "the winner can't afford this item."
        );

        return;
    }

    winner.money -= currentBid;
    winner.items.push(item);

    currentItemIndex++;

    showStatus(
        `player ${winnerIndex + 1} won ${item} for $${currentBid}.`
    );

    if (
        currentItemIndex >=
        items.length
    ) {
        endGame();
        return;
    }

    if (
        winner.items.length === 5
    ) {
        finishPlayer(winnerIndex);
        return;
    }

    currentBid = 1;
    highestBidder = null;

    currentPlayer =
        winnerIndex === 0
            ? 1
            : 0;

    bidInput.value = "";

    updateUI();
}

function finishPlayer(playerIndex) {
    const player =
        players[playerIndex];

    const otherIndex =
        playerIndex === 0
            ? 1
            : 0;

    const otherPlayer =
        players[otherIndex];

    while (
        currentItemIndex <
            items.length &&
        otherPlayer.items.length <
            5
    ) {
        const item =
            getCurrentItem();

        otherPlayer.items.push(item);

        currentItemIndex++;
    }

    if (
        currentItemIndex >=
        items.length
    ) {
        endGame();
        return;
    }

    currentBid = 1;
    highestBidder = null;

    currentPlayer =
        otherIndex;

    bidInput.value = "";

    showStatus(
        `player ${playerIndex + 1} filled all 5 slots. remaining items went to player ${otherIndex + 1}.`
    );

    updateUI();
}

function updateInventory() {
    for (
        let i = 0;
        i < 5;
        i++
    ) {
        const p1 =
            document.getElementById(
                `p1-slot-${i + 1}`
            );

        const p2 =
            document.getElementById(
                `p2-slot-${i + 1}`
            );

        if (p1) {
            if (player1.items[i]) {
                p1.textContent =
                    player1.items[i];

                p1.classList.add(
                    "filled"
                );
            } else {
                p1.textContent =
                    "Empty";

                p1.classList.remove(
                    "filled"
                );
            }
        }

        if (p2) {
            if (player2.items[i]) {
                p2.textContent =
                    player2.items[i];

                p2.classList.add(
                    "filled"
                );
            } else {
                p2.textContent =
                    "Empty";

                p2.classList.remove(
                    "filled"
                );
            }
        }
    }
}

function updateButtons() {
    const player =
        players[currentPlayer];

    const otherPlayer =
        players[
            currentPlayer === 0
                ? 1
                : 0
        ];

    if (!gameStarted) {
        bidButton.disabled = true;
        passButton.disabled = true;
        bidInput.disabled = true;
        return;
    }

    if (
        player.items.length >= 5
    ) {
        bidButton.disabled = true;
        passButton.disabled = true;
        bidInput.disabled = true;
        return;
    }

    bidInput.disabled =
        player.money < 1;

    bidButton.disabled =
        player.money < 1;

    if (
        highestBidder === null
    ) {
        bidInput.min = 1;

        passButton.disabled =
            otherPlayer.money !== 0;
    } else {
        bidInput.min =
            currentBid + 1;

        passButton.disabled = false;
    }
}

function updateUI() {
    money1Element.textContent =
        player1.money;

    money2Element.textContent =
        player2.money;

    count1Element.textContent =
        player1.items.length;

    count2Element.textContent =
        player2.items.length;

    if (
        currentItemIndex <
        items.length
    ) {
        currentItemElement.textContent =
            getCurrentItem();
    }

    currentBidElement.textContent =
        currentBid;

    itemsRemainingElement.textContent =
        Math.max(
            0,
            items.length -
                currentItemIndex
        );

    itemsAuctionedElement.textContent =
        currentItemIndex;

    turnElement.textContent =
        `Player ${currentPlayer + 1}'s turn`;

    if (
        highestBidder === null
    ) {
        highestBidderElement.textContent =
            "No bids yet";
    } else {
        highestBidderElement.textContent =
            `Player ${highestBidder + 1} is currently winning`;
    }

    document.body.classList.remove(
        "player1-turn",
        "player2-turn"
    );

    document.body.classList.add(
        currentPlayer === 0
            ? "player1-turn"
            : "player2-turn"
    );

    updateInventory();
    updateButtons();
}

function showStatus(message) {
    if (statusElement) {
        statusElement.textContent =
            message;
    }
}

function endGame() {
    gameStarted = false;

    currentItemElement.textContent =
        "Game Complete";

    turnElement.textContent =
        "The auction is over.";

    highestBidderElement.textContent =
        "";

    itemsRemainingElement.textContent =
        "0";

    itemsAuctionedElement.textContent =
        items.length;

    bidInput.disabled = true;
    bidButton.disabled = true;
    passButton.disabled = true;

    showStatus(
        "all 10 items have been auctioned!"
    );
}

async function startGame(mode) {
    gameStarted = false;

    bidInput.disabled = true;
    bidButton.disabled = true;
    passButton.disabled = true;

    player1.money = 20;
    player1.items = [];

    player2.money = 20;
    player2.items = [];

    currentPlayer = 0;
    currentItemIndex = 0;
    currentBid = 1;
    highestBidder = null;
    items = [];

    themeElement.textContent =
        "loading game...";

    currentItemElement.textContent =
        "loading...";

    updateUI();

    let generated = null;

    if (mode === "ai") {
        generated =
            await generateGame();
    }

    if (!generated) {
        generated =
            getPremadeGame();
    }

    themeElement.textContent =
        generated.theme;

    items =
        generated.items;

    currentItemIndex = 0;
    currentBid = 1;
    highestBidder = null;
    currentPlayer = 0;

    gameStarted = true;

    showStatus(
        "player 1 must start the bidding at $1."
    );

    updateUI();
}

function chooseAI() {
    modeScreen.style.display = "none";
    loadingScreen.style.display = "flex";
    gameElement.style.display = "none";

    setProgress(
        0,
        "getting ready..."
    );

    loadAI();
}

function choosePremade() {
    modeScreen.style.display = "none";
    loadingScreen.style.display = "none";
    gameElement.style.display = "block";

    startGame("premade");
}

bidButton.addEventListener(
    "click",
    () => {
        const bid =
            Number(bidInput.value);

        placeBid(bid);
    }
);

passButton.addEventListener(
    "click",
    () => {
        pass();
    }
);

bidInput.addEventListener(
    "keydown",
    event => {
        if (
            event.key === "Enter"
        ) {
            const bid =
                Number(bidInput.value);

            placeBid(bid);
        }
    }
);

newGameButton.addEventListener(
    "click",
    () => {
        startGame(
            aiReady
                ? "ai"
                : "premade"
        );
    }
);

if (aiModeButton) {
    aiModeButton.addEventListener(
        "click",
        chooseAI
    );
}

if (premadeModeButton) {
    premadeModeButton.addEventListener(
        "click",
        choosePremade
    );
}

modeScreen.style.display = "flex";
loadingScreen.style.display = "none";
gameElement.style.display = "none";
