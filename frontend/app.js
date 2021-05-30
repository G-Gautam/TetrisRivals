//Homepage button and input initialization
function setup() {
    const codeInput = document.getElementById('code-input');
    if (codeInput !== null || codeInput !== undefined) {
        codeInput.addEventListener('input', () => {
            if (codeInput.value.length == 6) {
                document.getElementById('join').disabled = false;
            } else {
                document.getElementById('join').disabled = true;
            }
        });
    }
}

//Create a new game
function createGame() {
    sessionStorage.clear();
    bridgeCreateGame();
}

//Join an existing game with code
function joinGame() {
    const codeInput = document.getElementById('code-input');
    const code = codeInput.value;
    bridgeJoinGame(code);
}

function codeValidActionarg() {
    sessionStorage.setItem("codeJoin", arg);
    location.href = 'game.html'
}


function loadCode() {
    const code = sessionStorage.getItem('code');
    var codeText = document.getElementById('code');
    codeText.innerHTML = `<span id=colorCode><b>Code</b></span> <br> ${code}`;
}

//Game.html
let canvasList;
let ctxList;
let canvasNextList;
let ctxNext;

let board;
let board2;
let time;
let requestId;


function ready() {
    addEventListener();
    board.reset();
    board2.reset();
    bridgeReady();
    var button = document.getElementById('ready1');
    button.style = "background-color: rgba(172, 255, 47, 0.308)";
}

function onGameLoad() {
    canvasList = document.getElementsByClassName('game-board');
    ctxList = [];
    [...canvasList].forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        // Calculate size of canvas from constants.
        ctx.canvas.width = COLS * BLOCK_SIZE;
        ctx.canvas.height = ROWS * BLOCK_SIZE;
        ctxList.push(ctx);
    })

    canvasNextList = document.getElementsByClassName('next');
    ctxNextList = [];
    [...canvasNextList].forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        ctxNextList.push(ctx);
    })

    ctxNext = ctxNextList[0]
    ctx = ctxList[0]

    board = new Board(ctx, ctxNext);
    board2 = new Board(ctxList[1], ctxNextList[1])
    time = null;
    requestId = null;

    loadCode();
    initNext();
    let readyButton = document.getElementById('ready1');
    readyButton.onclick = ready;
}


const moves = {
    [KEY.SPACE]: p => ({...p, y: p.y + 1 }),
    [KEY.LEFT]: p => ({...p, x: p.x - 1 }),
    [KEY.RIGHT]: p => ({...p, x: p.x + 1 }),
    [KEY.DOWN]: p => ({...p, y: p.y + 1 }),
    [KEY.RR]: p => board.rotate(p, ROTATION.RIGHT),
    [KEY.RL]: p => board.rotate(p, ROTATION.LEFT),
};

function initNext() {
    // Calculate size of canvas from constants.
    for (let i = 0; i < ctxNextList.length; i++) {
        ctxNextList[i].canvas.width = 4 * BLOCK_SIZE;
        ctxNextList[i].canvas.height = 4 * BLOCK_SIZE;
        ctxNextList[i].scale(BLOCK_SIZE, BLOCK_SIZE);
    }
}



function addEventListener() {
    document.removeEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(event) {
    if (moves[event.key]) {
        event.preventDefault();
        // Get new state
        let p = moves[event.key](board.piece);
        if (event.key === KEY.SPACE) {
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

function animate(now = 0) {
    time.elapsed = now - time.start;
    if (time.elapsed > time.level) {
        time.start = now;
        if (!board.drop()) {
            //gameOver();
            let audio = document.getElementById('audio');
            audio.pause();
            return;
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.init();
    board.draw();
    bridgeUpdateBoard(board.getGrid());
    requestId = requestAnimationFrame(animate);
}


function updateOpponent(state) {
    let readyButton = document.getElementById('ready2');
    if (state.ready == true) {
        readyButton.innerHTML = "Ready";
        readyButton.disabled = false;
        readyButton.style = "background-color: rgba(172, 255, 47, 0.308)";
    }
    board2.setGrid(state.board);

    // if (state.piece) {
    //     let piece = new Piece(ctxList[1]);
    //     piece.completePiece(state.piece.color, state.piece.hardDropped, state.piece.shape, state.piece.typeId, state.piece.x, state.piece.y);
    //     board2.setPiece(piece);
    // }
    ctxList[1].clearRect(0, 0, ctxList[1].canvas.width, ctxList[1].canvas.height);
    board2.init();
    board2.draw();
}

function startAnimation() {
    time = { start: performance.now(), elapsed: 0, level: 600 };
    animate();
}