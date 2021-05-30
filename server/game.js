module.exports = {
    createGameState,
}

function createGameState() {
    const gameState = {
        players: [{
                ready: false,
                board: null,
            },
            {
                ready: false,
                board: null,
            }
        ]
    }
    return gameState;
}