const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://admin:Nyancat12!@172.105.0.175:27017';
const dbName = 'tetris';
const collectionName = 'codes';

const { Server } = require("socket.io");
const io = new Server({
    cors: {
        origin: '*'
    }
});

const { createGameState } = require('./game');

const state = {};

io.on('connection', client => {
    const id = client.id;
    client.on("createGame", createGame);
    client.on("joinGame", joinGame);
    client.on("ready", ready);
    client.on("updatePosition", updatePosition);

    function createGame() {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            const code = Math.floor(Math.random() * 1000000);
            codeCollection.findOne({ cid: id, code: code }, (err, res) => {
                if (err) throw err;
                if (res == null) {
                    codeCollection.insertOne({ cid: id, code: code }, (err, res) => {
                        if (err) throw err;
                        console.log("Successful", code);

                        state[code] = createGameState();
                        client.join(code.toString());
                        client.number = 100;
                        let data = {
                            code: code,
                            playerNum: 1,
                        }

                        client.emit('gameCreated', data);
                        dbclient.close();
                    })
                } else {
                    client.emit("codeExists");
                }
            })
        })
    }

    function joinGame(code) {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            codeCollection.findOne({ code: parseInt(code) }, (err, res) => {
                if (err) throw err;
                if (res != null) {
                    const room = io.sockets.adapter.rooms.get(code);
                    let numPlayers = 0;
                    if (room) {
                        numPlayers = room.size;
                    }
                    if (numPlayers === 0) {
                        console.log('No users in the game');
                        client.emit("codeInvalid");
                        dbclient.close();
                        return;
                    } else if (numPlayers > 1) {
                        console.log("Too many users in the game");
                        client.emit("tooManyPlayers");
                        dbclient.close();
                        return;
                    } else {
                        codeCollection.insertOne({ cid: id, code: code }, (err, res) => {
                            if (err) throw err;
                            console.log("Successful Join", code);
                            dbclient.close();
                        });
                        client.number = 2;
                        client.join(code);
                        let data = {
                            code: code,
                            playerNum: 2,
                        }
                        client.emit("joinSuccessful", data);
                    }
                } else {
                    client.emit("codeInvalid");
                    dbclient.close();
                }
            })
        });
    }

    function ready(playerNum) {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            codeCollection.findOne({ cid: id }, (err, res) => {
                if (err) throw err;
                const code = res.code;
                if (playerNum == 1) {
                    state[code].players[0].ready = true;
                    io.to(code.toString()).emit('gameState', state[code]);
                } else {
                    state[code].players[1].ready = true;
                    io.to(code.toString()).emit('gameState', state[code]);
                }
                if (state[code].players[0].ready && state[code].players[1].ready) {
                    io.to(code.toString()).emit('startGame');
                }
                dbclient.close();
            })
        });
    }

    function updatePosition(board, playerNum) {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            codeCollection.findOne({ cid: id }, (err, res) => {
                if (err) throw err;
                const code = res.code;
                if (playerNum == 1) {
                    state[code].players[0].board = board;
                    io.to(code.toString()).emit('gameState', state[code]);
                } else {
                    state[code].players[1].board = board;
                    io.to(code.toString()).emit('gameState', state[code]);
                }
            });
        });
    }
});

io.listen(3000);