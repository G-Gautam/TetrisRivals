let socket;
let playerNum;

socket = io('http://localhost:3000');
socket.on("gameCreated", handleNewAndJoinGame);
//Try again (Makeshift recursion)
socket.on('codeExists', bridgeCreateGame);
socket.on('joinSuccessful', handleNewAndJoinGame);
socket.on('codeInvalid', invalidCodeAlert);
socket.on('tooManyPlayers', roomFullAlert);
socket.on('gameState', updateGameState);
socket.on('startGame', startGame);
socket.on('pieceChanged', pieceChanged);
socket.on('gameEnd', handleGameEnd);

function bridgeCreateGame() {
    socket.emit('createGame');
}

function bridgeJoinGame(code) {
    socket.emit('joinGame', code);
}

function bridgeReady() {
    socket.emit('ready', playerNum);
}

function bridgeUpdateBoard(board) {
    socket.emit('updateBoard', board, playerNum, sessionStorage.getItem('code'));
}

function bridgeUpdatePiece(piece) {
    socket.emit('updatePiece', piece, playerNum, sessionStorage.getItem('code'));
}

function bridgeChangePiece(piece) {
    socket.emit('changePiece', piece, playerNum, sessionStorage.getItem('code'));
}

function bridgeUpdateNextPiece(next) {
    socket.emit('updateNextPiece', next, playerNum, sessionStorage.getItem('code'));
}

function bridgeGameOver() {
    socket.emit('gameOver', playerNum, sessionStorage.getItem('code'));
    window.alert('YOU LOSE!');
}

function handleNewAndJoinGame(data) {
    playerNum = data.playerNum;
    sessionStorage.setItem('code', data.code);
    let indexPage = document.getElementById('index');
    let gamePage = document.createElement('div');
    gamePage.innerHTML = gameString.trim();
    let body = document.getElementById('body');
    indexPage.remove();
    body.appendChild(gamePage);
    onGameLoad();
}

function invalidCodeAlert() {
    window.alert("Code is Invalid");
}

function roomFullAlert() {
    window.alert("Game Room is Full");
}

function updateGameState(state) {
    if (playerNum == 1) {
        state = state.players[1];
    } else {
        state = state.players[0];
    }
    updateOpponent(state)
}

function pieceChanged(state) {
    if (playerNum == 1) {
        state = state.players[0];
    } else {
        state = state.players[1];
    }
    changeSelf(state)
}

function startGame() {
    startAnimation();
}

function handleGameEnd(winner) {
    if (winner == playerNum) {
        window.alert("YOU WIN");
    }
    window.cancelAnimationFrame(requestId);
}