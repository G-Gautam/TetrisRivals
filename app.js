startGameDummy = () => {
    location.href = 'game.html'
}

//Game.html

const canvasList = document.getElementsByClassName('game-board');
const ctxList = [];
[...canvasList].forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    // Calculate size of canvas from constants.
    ctx.canvas.width = COLS * BLOCK_SIZE;
    ctx.canvas.height = ROWS * BLOCK_SIZE;
    ctxList.push(ctx);
})

const canvasNextList = document.getElementsByClassName('next');
const ctxNextList = [];
[...canvasNextList].forEach((canvas) => {
    const ctx = canvas.getContext('2d');
    ctxNextList.push(ctx);
})

const ctxNext = ctxNextList[0]
const ctx = ctxList[0]

let board = new Board(ctx, ctxNext);

initNext = () => {
    // Calculate size of canvas from constants.
    ctxNext.canvas.width = 4 * BLOCK_SIZE;
    ctxNext.canvas.height = 4 * BLOCK_SIZE;
    ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE);
}

initNext();

function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    if (moves[event.key]) {
        event.preventDefault();
        // Get new state
        let p = moves[event.key](board.piece);
        if (event.key === KEY.SHIFT) {
            while (board.valid(p)) {
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
            board.piece.hardDrop();
        } else if (board.valid(p)) {
            board.piece.move(p);
        }
    }
}

startGame = () => {
    addEventListener();
    board.reset();
    time = { start: performance.now(), elapsed: 0 };
    animate();
}

animate = (now = 0) => {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            gameOver();
            return;
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.init();
    board.draw();
    requestId = requestAnimationFrame(animate);
}

const moves = {
    [KEY.SHIFT]: p => ({...p, y: p.y + 1 }),
    [KEY.LEFT]: p => ({...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1 }),
    [KEY.DOWN]: p => ({...p, y: p.y + 1 })
};

document.addEventListener('keydown', event => {
    console.log(event.key)
    if (moves[event.key]) {
        // Stop the event from bubbling.
        event.preventDefault();
        // Get new state of piece
        let p = moves[event.key](board.piece);

        if (board.valid(p)) {
            // If the move is valid, move the piece.
            board.piece.move(p);

            // Clear old position before drawing.
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            board.piece.draw();
        }
    }
    if (event.key === KEY.SHIFT) {
        // Hard drop
        while (board.valid(p)) {
            board.piece.move(p);
            p = moves[KEY.DOWN](board.piece);
        }
    }
});