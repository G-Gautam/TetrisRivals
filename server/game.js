module.exports = {
    createGameState,
}

function createGameState() {
    const gameState = {
        players: [{
                ready: false,
                board: null,
                piece: null,
                nextPiece: null,
            },
            {
                ready: false,
                board: null,
                piece: null,
                nextPiece: null,
            }
        ]
    }
    return gameState;
}