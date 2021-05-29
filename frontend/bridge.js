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
        var codeText = document.getElementById('code');
        codeText.innerHTML = `<span id=colorCode><b>Code</b></span> <br> ${code}`;
    }
})

socket.on('retryCode', () => {
    sendPrivateCode();
})