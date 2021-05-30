let socket;
let playerNum;

function bridgeSetup() {
    socket = io('http://localhost:3000');
    socket.on("gameCreated", handleNewGame);
    //Try again (Makeshift recursion)
    socket.on('codeExists', bridgeCreateGame);
    socket.on('joinSuccessful', joinGame);
    socket.on('codeInvalid', invalidCodeAlert);
    socket.on('tooManyPlayers', roomFullAlert);
}

function bridgeCreateGame() {
    socket.emit('createGame');
}

function bridgeJoinGame(code) {
    socket.emit('joinGame', code);
}

function handleNewGame(data) {
    playerNum = data.playerNum;
    sessionStorage.setItem('code', data.code);
    location.href = 'game.html';
}

function joinGame() {

}

function invalidCodeAlert() {
    window.alert("Code is Invalid");
}

function roomFullAlert() {
    window.alert("Game Room is Full");
}