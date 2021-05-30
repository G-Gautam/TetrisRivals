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


function bridgeCreateGame() {
    socket.emit('createGame');
}

function bridgeJoinGame(code) {
    socket.emit('joinGame', code);
}

function bridgeReady() {
    socket.emit('ready', playerNum);
}

function bridgeUpdateServer(board) {
    socket.emit('updatePosition', board, playerNum);
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

function startGame() {
    startAnimation();
}