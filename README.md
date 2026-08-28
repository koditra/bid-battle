# Bid Battle

Bid Battle is a 2-player auction game where you compete to build the best thing by bidding on different parts :)

<img width="756" height="412" alt="Screenshot 2026-08-27 at 9 07 27 PM" src="https://github.com/user-attachments/assets/95060c61-c1fb-4164-87ea-25a0f4012983" />

## how it works

- both players start with $20
- choose between AI Mode or Premade Mode
- AI Mode generates a unique theme and 10 items
- players take turns bidding on each item
- the highest bidder gets the item
- each player can have up to 5 items
- once a player fills all 5 slots, the remaining items go to the other player for $1 each
- Player 1 has to start the first auction with a $1 bid

## AI Mode

AI Mode uses WebLLM to run Llama 3.2 1B directly in the browser.

the AI creates a theme and 10 related items. it also has multiple fallback games so the game can still work if the AI has trouble generating something.

the AI model can take a while to download the first time, so there is a loading screen with a progress bar.

## Premade Mode

Premade Mode skips the AI and starts instantly.

it includes multiple different themes with items that fit each theme.

## features

- 2-player local multiplayer
- $20 starting money
- 10 items per game
- 5 item inventory limit
- bidding and passing
- AI-generated games
- premade games
- local AI
- AI loading progress
- fallback games
- red and blue gradient player themes

## built with

- HTML
- CSS
- JavaScript
- WebLLM
- WebGPU
- Llama 3.2 1B

## controls

enter a bid and press **Bid** to increase the current bid.

press **Pass** to end the auction once a bid has been placed.

you can't pass on the first turn because Player 1 has to start the auction with $1.

thanks for playing Bid Battle :)
