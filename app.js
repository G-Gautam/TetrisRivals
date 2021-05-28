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

const moves = {
    [KEY.SHIFT]: p => ({...p, y: p.y + 1 }),
    [KEY.LEFT]: p => ({...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1 }),
    [KEY.DOWN]: p => ({...p, y: p.y + 1 }),
    [KEY.SPACE]: p => board.rotate(p, ROTATION.RIGHT),
    [KEY.Q]: p => board.rotate(p, ROTATION.LEFT),
};

initNext = () => {
    // Calculate size of canvas from constants.
    for (let i = 0; i < ctxNextList.length; i++) {
        ctxNextList[i].canvas.width = 4 * BLOCK_SIZE;
        ctxNextList[i].canvas.height = 4 * BLOCK_SIZE;
        ctxNextList[i].scale(BLOCK_SIZE, BLOCK_SIZE);
    }
    console.log(ctxNextList);
}

initNext();

let board = new Board(ctx, ctxNext);
let board2 = new Board(ctxList[1], ctxNextList[1])
let time = null;
let requestId = null;

addEventListener = () => {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

handleKeyPress = (event) => {
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

startGame = () => {
    addEventListener();
    board.reset();
    time = { start: performance.now(), elapsed: 0, level: 600 };
    animate();
}