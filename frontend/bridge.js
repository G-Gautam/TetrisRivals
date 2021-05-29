const socket = io('http://localhost:3000');
socket.on('init', handleInit);

function handleInit(msg) {
    console.log(msg);
}

function sendPrivateCode() {
    socket.emit("privateCode");
}

socket.on('returnPrivateCode', (code) => {
    if (code) {
        sessionStorage.setItem('code', code);
        var codeText = document.getElementById('code');
        codeText.innerHTML = `<span id=colorCode><b>Code</b></span> <br> ${code}`;
    }
})

socket.on('retryCode', () => {
    sendPrivateCode();
})


function isCodeValid(code) {
    socket.emit('checkCode', code);
}

socket.on('codeValid', (arg) => {
    codeValidAction(arg);
});

socket.on('codeInvalid', () => {
    window.alert("Code is invalid");
})

function signalReady() {
    socket.emit("ready", 0);
}

socket.on('updateGameState', (gamestate) => {
    updateGameState(JSON.parse(gamestate));
})