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
let engine = null;
let aiReady = false;
let gameMode = null;
let gameStarted = false;

const MODEL = "Llama-3.2-1B-Instruct-q4f16_1-MLC";

const gameIdeas = [
    "an underwater research station",
    "a floating city",
    "a futuristic airport",
    "an amusement park",
    "an underground laboratory",
    "a moon base",
    "a deep sea submarine",
    "a medieval castle",
    "a sports stadium",
    "a robot factory",
    "a wildlife rescue center",
    "a space station",
    "a giant aquarium",
    "a mountain research facility",
    "a futuristic train station",
    "an arctic research base",
    "a high-tech museum",
    "a desert expedition base",
    "a giant concert arena",
    "a futuristic hospital",
    "a volcano research station",
    "a jungle expedition base",
    "a giant observatory",
    "a movie studio",
    "a futuristic farm",
    "a secret spy headquarters",
    "a disaster rescue center",
    "a giant greenhouse",
    "a fantasy wizard tower",
    "an ocean cleanup station"
];

const premadeGames = [
    {
        theme: "Build Your Own Supercar",
        items: [
            "V12 Engine",
            "Carbon Fiber Body",
            "Racing Tires",
            "Turbocharger",
            "Adjustable Spoiler",
            "Racing Suspension",
            "Leather Seats",
            "Nitrous System",
            "Ceramic Brakes",
            "Custom Exhaust"
        ]
    },
    {
        theme: "Build Your Own Spaceship",
        items: [
            "Fusion Reactor",
            "Rocket Engines",
            "Shield Generator",
            "Navigation Computer",
            "Cargo Bay",
            "Life Support",
            "Laser Cannons",
            "Escape Pods",
            "Solar Panels",
            "Hyperdrive"
        ]
    },
    {
        theme: "Build Your Own Theme Park",
        items: [
            "Roller Coaster",
            "Ferris Wheel",
            "Water Ride",
            "Arcade Hall",
            "Food Court",
            "Haunted House",
            "Go-Kart Track",
            "Fireworks System",
            "VIP Lounge",
            "Park Entrance"
        ]
    },
    {
        theme: "Build Your Own Luxury Hotel",
        items: [
            "Penthouse Suite",
            "Infinity Pool",
            "Rooftop Restaurant",
            "Spa",
            "Private Theater",
            "Grand Lobby",
            "Helipad",
            "Gym",
            "Conference Center",
            "Private Beach"
        ]
    },
    {
        theme: "Build Your Own Medieval Castle",
        items: [
            "Stone Walls",
            "Drawbridge",
            "Castle Tower",
            "Moat",
            "Throne Room",
            "Armory",
            "Secret Tunnel",
            "Great Hall",
            "Guard Barracks",
            "Catapult"
        ]
    },
    {
        theme: "Build Your Own Robot",
        items: [
            "Power Core",
            "Robot Arms",
            "AI Computer",
            "Jet Boosters",
            "Laser Eyes",
            "Armor Plating",
            "Sensor Array",
            "Hydraulic Legs",
            "Energy Shield",
            "Tool Attachment"
        ]
    },
    {
        theme: "Build Your Own Race Track",
        items: [
            "Starting Grid",
            "Pit Lane",
            "Grandstands",
            "Hairpin Turn",
            "Lap Timing System",
            "Safety Barriers",
            "Floodlights",
            "Control Tower",
            "Paddock",
            "Finish Line"
        ]
    }
];

const aiFallbackGames = [
    {
        theme: "Underwater Research Station",
        items: [
            "Glass Dome",
            "Sonar Array",
            "Submarine Dock",
            "Oxygen Generator",
            "Deep Sea Camera",
            "Pressure Door",
            "Research Lab",
            "Sea Drone",
            "Power Reactor",
            "Observation Deck"
        ]
    },
    {
        theme: "Volcano Research Base",
        items: [
            "Lava Sensor",
            "Seismic Scanner",
            "Cooling System",
            "Research Lab",
            "Emergency Shelter",
            "Drone Station",
            "Sample Storage",
            "Observation Tower",
            "Radio Tower",
            "Helipad"
        ]
    },
    {
        theme: "Dinosaur Theme Park",
        items: [
            "T-Rex Habitat",
            "Raptor Enclosure",
            "Electric Fence",
            "Safari Jeep",
            "Fossil Museum",
            "Feeding Station",
            "Research Lab",
            "Visitor Center",
            "Observation Tower",
            "Park Entrance"
        ]
    },
    {
        theme: "Arctic Research Camp",
        items: [
            "Ice Laboratory",
            "Snowmobile",
            "Weather Station",
            "Research Dome",
            "Heating System",
            "Ice Drill",
            "Supply Depot",
            "Radio Tower",
            "Observation Deck",
            "Emergency Shelter"
        ]
    },
    {
        theme: "Giant Aquarium",
        items: [
            "Shark Tank",
            "Jellyfish Tunnel",
            "Coral Reef",
            "Penguin Habitat",
            "Ocean Theater",
            "Research Center",
            "Touch Pool",
            "Glass Tunnel",
            "Feeding System",
            "Main Entrance"
        ]
    },
    {
        theme: "Secret Spy Headquarters",
        items: [
            "Hidden Elevator",
            "Control Room",
            "Security System",
            "Gadget Lab",
            "Training Room",
            "Secret Tunnel",
            "Surveillance Hub",
            "Vehicle Garage",
            "Code Room",
            "Escape Route"
        ]
    },
    {
        theme: "Floating Sky City",
        items: [
            "Sky Bridges",
            "Floating Platform",
            "Wind Turbines",
            "Cloud Gardens",
            "Landing Pad",
            "Central Tower",
            "Weather Shield",
            "Solar Array",
            "Transit Hub",
            "Gravity Generator"
        ]
    },
    {
        theme: "Jungle Expedition Base",
        items: [
            "Research Tent",
            "Watch Tower",
            "River Dock",
            "Supply Depot",
            "Rain Collector",
            "Radio Tower",
            "Medical Station",
            "Generator",
            "Map Room",
            "Observation Platform"
        ]
    },
    {
        theme: "Giant Space Observatory",
        items: [
            "Main Telescope",
            "Star Scanner",
            "Observation Dome",
            "Control Center",
            "Solar Array",
            "Research Lab",
            "Satellite Dish",
            "Data Center",
            "Crew Quarters",
            "Launch Platform"
        ]
    },
    {
        theme: "Futuristic Concert Arena",
        items: [
            "Main Stage",
            "Hologram System",
            "Laser Lights",
            "Sound System",
            "VIP Lounge",
            "Backstage",
            "Crowd Barriers",
            "Drone Cameras",
            "Food Court",
            "Ticket Plaza"
        ]
    },
    {
        theme: "Giant Wildlife Sanctuary",
        items: [
            "Elephant Habitat",
            "Bird Aviary",
            "Veterinary Center",
            "Watering Station",
            "Forest Zone",
            "Research Cabin",
            "Rescue Center",
            "Visitor Center",
            "Observation Tower",
            "Ranger Station"
        ]
    },
    {
        theme: "Underground Science Laboratory",
        items: [
            "Main Laboratory",
            "Reactor Room",
            "Security Door",
            "Testing Chamber",
            "Computer Core",
            "Storage Vault",
            "Observation Room",
            "Power Generator",
            "Decontamination Room",
            "Emergency Exit"
        ]
    },
    {
        theme: "Giant Amusement Pier",
        items: [
            "Ferris Wheel",
            "Roller Coaster",
            "Arcade Hall",
            "Food Court",
            "Boat Ride",
            "Prize Center",
            "Game Booths",
            "Observation Deck",
            "Fireworks Platform",
            "Ticket Gate"
        ]
    },
    {
        theme: "Desert Survival Outpost",
        items: [
            "Water Tank",
            "Solar Farm",
            "Radio Tower",
            "Supply Depot",
            "Shade Shelter",
            "Weather Station",
            "Medical Tent",
            "Watch Tower",
            "Sand Vehicle",
            "Emergency Beacon"
        ]
    },
    {
        theme: "Giant Movie Studio",
        items: [
            "Sound Stage",
            "Green Screen",
            "Camera Rig",
            "Editing Suite",
            "Prop Warehouse",
            "Costume Department",
            "Lighting Grid",
            "Recording Booth",
            "Makeup Room",
            "Premiere Theater"
        ]
    },
    {
        theme: "Fantasy Wizard Tower",
        items: [
            "Spell Library",
            "Potion Lab",
            "Magic Observatory",
            "Crystal Chamber",
            "Enchanted Garden",
            "Teleport Room",
            "Dragon Balcony",
            "Artifact Vault",
            "Training Hall",
            "Grand Staircase"
        ]
    },
    {
        theme: "Giant Greenhouse",
        items: [
            "Plant Nursery",
            "Irrigation System",
            "Climate Controller",
            "Seed Vault",
            "Research Lab",
            "Pollination Room",
            "Solar Roof",
            "Water Tank",
            "Garden Dome",
            "Compost Center"
        ]
    },
    {
        theme: "Mountain Rescue Center",
        items: [
            "Helipad",
            "Rescue Garage",
            "Medical Bay",
            "Weather Station",
            "Radio Tower",
            "Climbing Gear Room",
            "Snowmobile Garage",
            "Emergency Shelter",
            "Command Center",
            "Search Drone"
        ]
    },
    {
        theme: "Futuristic Robot Factory",
        items: [
            "Assembly Line",
            "Robot Arms",
            "Parts Warehouse",
            "AI Core",
            "Testing Chamber",
            "Charging Station",
            "Control Room",
            "Laser Cutter",
            "Quality Lab",
            "Shipping Bay"
        ]
    },
    {
        theme: "Giant Space Hotel",
        items: [
            "Orbital Lobby",
            "Zero-G Pool",
            "Luxury Suites",
            "Space Restaurant",
            "Observation Lounge",
            "Docking Bay",
            "Artificial Garden",
            "Entertainment Deck",
            "Shuttle Terminal",
            "Gravity System"
        ]
    }
];

const gameModeScreen = document.getElementById("game-mode-screen");
const aiModeButton = document.getElementById("ai-mode-button");
const premadeModeButton = document.getElementById("premade-mode-button");
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
const itemsRemainingElement = document.getElementById("items-remaining");
const itemsAuctionedElement = document.getElementById("items-auctioned");
const statusElement = document.getElementById("auction-status");
const newGameButton = document.getElementById("new-game-button");
const loadingScreen = document.getElementById("ai-loading");
const loadingText = document.getElementById("ai-loading-text");
const progressBar = document.getElementById("ai-progress");
const percentText = document.getElementById("ai-percent");

function showModeScreen() {
    if (gameModeScreen) {
        gameModeScreen.style.display = "flex";
    }

    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }

    const game = document.getElementById("game");

    if (game) {
        game.style.display = "none";
    }

    gameStarted = false;
    updateUI();
}

function showLoadingScreen() {
    if (gameModeScreen) {
        gameModeScreen.style.display = "none";
    }

    if (loadingScreen) {
        loadingScreen.style.display = "flex";
    }

    const game = document.getElementById("game");

    if (game) {
        game.style.display = "none";
    }
}

function showGameScreen() {
    if (gameModeScreen) {
        gameModeScreen.style.display = "none";
    }

    if (loadingScreen) {
        loadingScreen.style.display = "none";
    }

    const game = document.getElementById("game");

    if (game) {
        game.style.display = "block";
    }
}

async function choosePremadeGame() {
    gameMode = "premade";
    showGameScreen();
    await startGame();
}

async function chooseAIGame() {
    gameMode = "ai";
    showLoadingScreen();

    loadingText.textContent =
        "AI takes a while to load the first time.";

    progressBar.style.width = "0%";
    percentText.textContent = "0%";

    await new Promise(resolve =>
        setTimeout(resolve, 800)
    );

    await loadAI();
}

async function loadAI() {
    try {
        loadingText.textContent =
            "Checking WebGPU...";

        progressBar.style.width = "5%";
        percentText.textContent = "5%";

        if (!navigator.gpu) {
            throw new Error("WebGPU unavailable");
        }

        const adapter =
            await navigator.gpu.requestAdapter();

        if (!adapter) {
            throw new Error("No GPU");
        }

        loadingText.textContent =
            "Downloading local AI model...";

        progressBar.style.width = "10%";
        percentText.textContent = "10%";

        engine = await CreateMLCEngine(
            MODEL,
            {
                initProgressCallback: progress => {
                    if (
                        typeof progress.progress === "number"
                    ) {
                        const percent =
                            Math.round(
                                progress.progress * 100
                            );

                        const displayPercent =
                            Math.max(
                                10,
                                Math.min(
                                    99,
                                    percent
                                )
                            );

                        progressBar.style.width =
                            `${displayPercent}%`;

                        percentText.textContent =
                            `${displayPercent}%`;
                    }

                    if (progress.text) {
                        loadingText.textContent =
                            progress.text;
                    }
                }
            }
        );

        aiReady = true;

        progressBar.style.width = "100%";
        percentText.textContent = "100%";
        loadingText.textContent = "AI ready!";

        await new Promise(resolve =>
            setTimeout(resolve, 700)
        );

        showGameScreen();
        await startGame();

    } catch (error) {
        console.warn(
            "AI loading failed:",
            error
        );

        aiReady = false;

        progressBar.style.width = "100%";
        percentText.textContent = "100%";
        loadingText.textContent = "Starting game...";

        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );

        showGameScreen();
        await startGame();
    }
}

async function generateGame() {
    if (!engine || !aiReady) {
        throw new Error("AI unavailable");
    }

    const idea =
        gameIdeas[
            Math.floor(
                Math.random() * gameIdeas.length
            )
        ];

    const prompt = `
Create a creative two-player bidding game.

Theme idea:
${idea}

Players will buy parts in an auction and use those parts to build the thing.

Create:
- One creative theme name
- Exactly 10 parts

Every part must clearly belong to the theme.

Rules:
- Do not make random unrelated items.
- Do not use generic objects.
- Do not use "Item 1", "Item 2", etc.
- Do not include prices.
- Do not explain anything.
- Do not use markdown.
- Do not use code fences.
- Return ONLY valid JSON.

Format:

{
    "theme": "creative theme name",
    "items": [
        "part 1",
        "part 2",
        "part 3",
        "part 4",
        "part 5",
        "part 6",
        "part 7",
        "part 8",
        "part 9",
        "part 10"
    ]
}
`;

    const response =
        await engine.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You create creative auction games. Output valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 1.3,
            max_tokens: 600
        });

    const text =
        response.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error("Empty response");
    }

    return parseAIResponse(text);
}

function parseAIResponse(text) {
    let cleaned = String(text).trim();

    cleaned = cleaned.replace(
        /```json/gi,
        ""
    );

    cleaned = cleaned.replace(
        /```/g,
        ""
    );

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (
        start === -1 ||
        end === -1
    ) {
        throw new Error("No JSON");
    }

    cleaned =
        cleaned.substring(
            start,
            end + 1
        );

    let data;

    try {
        data = JSON.parse(cleaned);
    } catch {
        throw new Error("Invalid JSON");
    }

    if (
        typeof data.theme !== "string"
    ) {
        throw new Error("Invalid theme");
    }

    if (
        !Array.isArray(data.items)
    ) {
        throw new Error("Invalid items");
    }

    const cleanItems =
        data.items
            .map(item => String(item).trim())
            .filter(item => item.length > 0);

    const uniqueItems =
        [...new Set(cleanItems)];

    if (
        uniqueItems.length < 10
    ) {
        throw new Error("Not enough items");
    }

    return {
        theme: data.theme.trim(),
        items: uniqueItems.slice(0, 10)
    };
}

async function generateWithRetry() {
    for (
        let attempt = 1;
        attempt <= 3;
        attempt++
    ) {
        try {
            const game =
                await generateGame();

            if (
                game &&
                game.theme &&
                Array.isArray(game.items) &&
                game.items.length === 10
            ) {
                return game;
            }
        } catch (error) {
            console.warn(
                `AI attempt ${attempt} failed:`,
                error
            );

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );
        }
    }

    const fallback =
        aiFallbackGames[
            Math.floor(
                Math.random() *
                aiFallbackGames.length
            )
        ];

    return {
        theme: fallback.theme,
        items: [...fallback.items]
    };
}

function getCurrentItem() {
    return items[currentItemIndex];
}

function money(value) {
    return Math.round(value * 100) / 100;
}

function nextAvailablePlayer(startIndex) {
    for (let i = 0; i < 2; i++) {
        const index =
            (startIndex + i) % 2;

        const player =
            players[index];

        if (
            player.items.length < 5 &&
            player.money > 0
        ) {
            return index;
        }
    }

    return null;
}

function placeBid(value) {
    if (!gameStarted) {
        return;
    }

    const player =
        players[currentPlayer];

    const bid =
        money(Number(value));

    if (
        !Number.isFinite(bid) ||
        bid < 1
    ) {
        showStatus(
            "The minimum bid is $1."
        );
        return;
    }

    if (
        highestBidder !== null &&
        bid <= currentBid
    ) {
        showStatus(
            `Your bid must be higher than $${currentBid.toFixed(2)}.`
        );
        return;
    }

    if (
        bid > player.money
    ) {
        showStatus(
            "You don't have enough money."
        );
        return;
    }

    if (
        player.items.length >= 5
    ) {
        moveToNextPlayer();
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
        `Player ${highestBidder + 1} bid $${currentBid.toFixed(2)}.`
    );

    updateUI();
    checkPlayerTurn();
}

function moveToNextPlayer() {
    const next =
        nextAvailablePlayer(
            currentPlayer === 0 ? 1 : 0
        );

    if (next === null) {
        if (highestBidder !== null) {
            awardItem();
        } else {
            distributeRemainingItems();
        }

        return;
    }

    currentPlayer = next;

    updateUI();
    checkPlayerTurn();
}

function checkPlayerTurn() {
    if (!gameStarted) {
        return;
    }

    if (
        currentItemIndex >= items.length
    ) {
        endGame();
        return;
    }

    const player =
        players[currentPlayer];

    if (
        player.items.length >= 5
    ) {
        const next =
            nextAvailablePlayer(
                currentPlayer === 0 ? 1 : 0
            );

        if (next !== null) {
            currentPlayer = next;
            updateUI();
            return;
        }

        if (highestBidder !== null) {
            awardItem();
        } else {
            distributeRemainingItems();
        }

        return;
    }

    if (
        player.money <= 0
    ) {
        if (
            highestBidder !== null
        ) {
            showStatus(
                `Player ${currentPlayer + 1} has no money and passes.`
            );

            setTimeout(() => {
                pass();
            }, 300);
        } else {
            moveToNextPlayer();
        }

        return;
    }

    updateUI();
}

function pass() {
    if (!gameStarted) {
        return;
    }

    if (
        currentItemIndex >= items.length
    ) {
        endGame();
        return;
    }

    const player =
        players[currentPlayer];

    if (
        player.items.length >= 5
    ) {
        moveToNextPlayer();
        return;
    }

    if (
        player.money <= 0
    ) {
        moveToNextPlayer();
        return;
    }

    if (
        highestBidder === null
    ) {
        const otherIndex =
            currentPlayer === 0 ? 1 : 0;

        const otherPlayer =
            players[otherIndex];

        if (
            otherPlayer.money <= 0
        ) {
            const item =
                getCurrentItem();

            otherPlayer.items.push(item);
            currentItemIndex++;

            showStatus(
                `Player ${currentPlayer + 1} passed. ${item} went to Player ${otherIndex + 1} for $0.`
            );

            if (
                currentItemIndex >= items.length
            ) {
                updateUI();
                endGame();
                return;
            }

            currentBid = 1;
            highestBidder = null;
            currentPlayer = otherIndex;
            bidInput.value = "";

            updateUI();
            checkPlayerTurn();

            return;
        }

        if (
            otherPlayer.items.length >= 5
        ) {
            moveToNextPlayer();
            return;
        }

        showStatus(
            "You can't pass until someone bids $1."
        );

        return;
    }

    awardItem();
}

function awardItem() {
    if (!gameStarted) {
        return;
    }

    const winnerIndex =
        highestBidder;

    if (
        winnerIndex === null
    ) {
        return;
    }

    const winner =
        players[winnerIndex];

    const item =
        getCurrentItem();

    if (!item) {
        endGame();
        return;
    }

    if (
        winner.items.length >= 5
    ) {
        currentPlayer =
            winnerIndex === 0 ? 1 : 0;

        updateUI();
        checkPlayerTurn();

        return;
    }

    if (
        winner.money < currentBid
    ) {
        showStatus(
            "The winner can't afford this item."
        );
        return;
    }

    winner.money =
        money(
            winner.money - currentBid
        );

    winner.items.push(item);
    currentItemIndex++;

    showStatus(
        `Player ${winnerIndex + 1} won ${item} for $${currentBid.toFixed(2)}.`
    );

    updateUI();

    if (
        currentItemIndex >= items.length
    ) {
        endGame();
        return;
    }

    currentBid = 1;
    highestBidder = null;

    const otherIndex =
        winnerIndex === 0 ? 1 : 0;

    const next =
        nextAvailablePlayer(
            otherIndex
        );

    currentPlayer =
        next !== null
            ? next
            : winnerIndex;

    bidInput.value = "";

    updateUI();
    checkPlayerTurn();
}

function distributeRemainingItems() {
    while (
        currentItemIndex < items.length
    ) {
        const available =
            players.filter(
                player =>
                    player.items.length < 5
            );

        if (
            available.length === 0
        ) {
            break;
        }

        let target;

        if (
            player1.items.length < 5 &&
            player2.items.length < 5
        ) {
            target =
                player1.items.length <=
                player2.items.length
                    ? player1
                    : player2;
        } else {
            target = available[0];
        }

        const item =
            getCurrentItem();

        if (
            target.money >= 1
        ) {
            target.money =
                money(
                    target.money - 1
                );
        }

        target.items.push(item);
        currentItemIndex++;
    }

    updateUI();
    endGame();
}

function updateUI() {
    if (money1Element) {
        money1Element.textContent =
            player1.money.toFixed(2);
    }

    if (money2Element) {
        money2Element.textContent =
            player2.money.toFixed(2);
    }

    if (count1Element) {
        count1Element.textContent =
            player1.items.length;
    }

    if (count2Element) {
        count2Element.textContent =
            player2.items.length;
    }

    if (
        currentItemElement &&
        currentItemIndex < items.length
    ) {
        currentItemElement.textContent =
            getCurrentItem();
    }

    if (currentBidElement) {
        currentBidElement.textContent =
            currentBid.toFixed(2);
    }

    if (itemsRemainingElement) {
        itemsRemainingElement.textContent =
            Math.max(
                0,
                items.length -
                currentItemIndex
            );
    }

    if (itemsAuctionedElement) {
        itemsAuctionedElement.textContent =
            currentItemIndex;
    }

    if (turnElement) {
        turnElement.textContent =
            gameStarted
                ? `Player ${currentPlayer + 1}'s turn`
                : "Choose a game mode";
    }

    if (highestBidderElement) {
        highestBidderElement.textContent =
            highestBidder === null
                ? "No bids yet"
                : `Player ${highestBidder + 1} is currently winning`;
    }

    document.body.classList.remove(
        "player1-turn",
        "player2-turn"
    );

    if (gameStarted) {
        document.body.classList.add(
            currentPlayer === 0
                ? "player1-turn"
                : "player2-turn"
        );
    }

    updateInventory();
    updateButtons();
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
            p1.textContent =
                player1.items[i] ||
                "Empty";

            p1.classList.toggle(
                "filled",
                Boolean(
                    player1.items[i]
                )
            );
        }

        if (p2) {
            p2.textContent =
                player2.items[i] ||
                "Empty";

            p2.classList.toggle(
                "filled",
                Boolean(
                    player2.items[i]
                )
            );
        }
    }
}

function updateButtons() {
    if (
        !bidButton ||
        !passButton ||
        !bidInput
    ) {
        return;
    }

    if (!gameStarted) {
        bidButton.disabled = true;
        passButton.disabled = true;
        bidInput.disabled = true;
        return;
    }

    const player =
        players[currentPlayer];

    if (
        player.items.length >= 5
    ) {
        bidButton.disabled = true;
        passButton.disabled = true;
        bidInput.disabled = true;
        return;
    }

    if (
        player.money <= 0
    ) {
        bidButton.disabled = true;
        bidInput.disabled = true;

        passButton.disabled =
            highestBidder === null;

        return;
    }

    bidButton.disabled = false;
    bidInput.disabled = false;

    bidInput.step = "0.01";

    if (
        highestBidder === null
    ) {
        bidInput.min = "1";
        bidInput.placeholder = "1.00";

        const otherPlayer =
            players[
                currentPlayer === 0 ? 1 : 0
            ];

        passButton.disabled =
            !(
                otherPlayer.money <= 0 ||
                otherPlayer.items.length >= 5
            );
    } else {
        const minimum =
            money(
                currentBid + 0.01
            );

        bidInput.min =
            minimum.toFixed(2);

        bidInput.placeholder =
            minimum.toFixed(2);

        passButton.disabled = false;
    }
}

function showStatus(message) {
    if (statusElement) {
        statusElement.textContent =
            message;
    }
}

function endGame() {
    gameStarted = false;

    updateInventory();

    if (currentItemElement) {
        currentItemElement.textContent =
            "Game Complete";
    }

    if (turnElement) {
        turnElement.textContent =
            "The auction is over.";
    }

    if (highestBidderElement) {
        highestBidderElement.textContent =
            "";
    }

    if (itemsRemainingElement) {
        itemsRemainingElement.textContent =
            "0";
    }

    if (itemsAuctionedElement) {
        itemsAuctionedElement.textContent =
            items.length;
    }

    if (bidInput) {
        bidInput.disabled = true;
    }

    if (bidButton) {
        bidButton.disabled = true;
    }

    if (passButton) {
        passButton.disabled = true;
    }

    showStatus(
        "All 10 items have been auctioned!"
    );
}

async function startGame() {
    gameStarted = false;

    player1.money = 20;
    player1.items = [];

    player2.money = 20;
    player2.items = [];

    currentPlayer = 0;
    currentItemIndex = 0;
    currentBid = 1;
    highestBidder = null;
    items = [];

    bidInput.disabled = true;
    bidButton.disabled = true;
    passButton.disabled = true;

    themeElement.textContent =
        "Loading theme...";

    currentItemElement.textContent =
        "Loading items...";

    updateUI();

    try {
        if (
            gameMode === "premade"
        ) {
            const game =
                premadeGames[
                    Math.floor(
                        Math.random() *
                        premadeGames.length
                    )
                ];

            themeElement.textContent =
                game.theme;

            items =
                [...game.items];
        } else {
            const generated =
                await generateWithRetry();

            themeElement.textContent =
                generated.theme;

            items =
                [...generated.items];
        }

        if (
            !Array.isArray(items) ||
            items.length !== 10
        ) {
            throw new Error(
                "Invalid game"
            );
        }

        currentPlayer = 0;
        currentItemIndex = 0;
        currentBid = 1;
        highestBidder = null;
        gameStarted = true;

        showStatus(
            "Player 1 must start the bidding at $1."
        );

        updateUI();
        checkPlayerTurn();

    } catch (error) {
        console.warn(
            "Game error:",
            error
        );

        const fallback =
            gameMode === "ai"
                ? aiFallbackGames[
                    Math.floor(
                        Math.random() *
                        aiFallbackGames.length
                    )
                ]
                : premadeGames[0];

        themeElement.textContent =
            fallback.theme;

        items =
            [...fallback.items];

        currentPlayer = 0;
        currentItemIndex = 0;
        currentBid = 1;
        highestBidder = null;
        gameStarted = true;

        showStatus(
            "Player 1 must start the bidding at $1."
        );

        updateUI();
        checkPlayerTurn();
    }
}

if (aiModeButton) {
    aiModeButton.addEventListener(
        "click",
        chooseAIGame
    );
}

if (premadeModeButton) {
    premadeModeButton.addEventListener(
        "click",
        choosePremadeGame
    );
}

if (bidButton) {
    bidButton.addEventListener(
        "click",
        () => {
            placeBid(
                bidInput.value
            );
        }
    );
}

if (passButton) {
    passButton.addEventListener(
        "click",
        pass
    );
}

if (bidInput) {
    bidInput.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Enter"
            ) {
                placeBid(
                    bidInput.value
                );
            }
        }
    );
}

if (newGameButton) {
    newGameButton.addEventListener(
        "click",
        showModeScreen
    );
}

showModeScreen();
updateUI();
