module.exports = {
    createGameState,
}

function createGameState() {
    const gameState = {
        players: [{
                ready: false,
                board: null,
                piece: null,
            },
            {
                ready: false,
                board: null,
                piece: null,
            }
        ]
    }
    return gameState;
}