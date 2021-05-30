const socket = io('http://localhost:3000');
let playerNum;

socket.on("gameCreated", handleNewGame);
//Try again (Makeshift recursion)
socket.on('codeExists', bridgeCreateGame);

socket.on('test', () => {
    console.log("test");
})

function handleNewGame(data) {
    playerNum = data.playerNum;
    sessionStorage.setItem('code', data.code);
    location.href = 'game.html';
    // var codeText = document.getElementById('code');
    // codeText.innerHTML = `<span id=colorCode><b>Code</b></span> <br> ${data.code}`;
}

function bridgeCreateGame() {
    socket.emit('createGame');
}

function bridgeJoinGame(code) {
    socket.emit('joinGame', code);
}

socket.on('codeValid', (arg) => {
    codeValidAction(arg);
});

socket.on('codeInvalid', () => {
    window.alert("Code is invalid");
})

socket.on('tooManyPlayers', () => {
    window.alert("Too many players in the game");
})

function signalReady() {
    socket.emit("ready", 0);
}

socket.on('updateGameState', (gamestate) => {
    updateGameState(JSON.parse(gamestate));
})