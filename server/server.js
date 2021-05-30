var app = require('express')();
var server = require('http').Server(app);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://admin:Nyancat12!@172.105.0.175:27017';
const dbName = 'tetris';
const collectionName = 'codes';

const io = require('socket.io')(server, {
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

                        state[id] = createGameState();
                        client.join(code);
                        client.number = 1;

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
                    client.emit("codeValid", code);
                    const room = client.sockets.adapter.rooms[code];
                    let allPlayers;
                    if (room) {
                        allPlayers = room.sockets;
                    }
                    let numPlayers = 0;
                    if (allPlayers) {
                        numPlayers = Object.keys(allPlayers).length;
                    }
                    if (numPlayers === 0) {
                        console.log('No users in the game');
                        client.emit("codeInvalid");
                        return;
                    } else if (numPlayers > 1) {
                        console.log("Too many users in the game");
                        client.emit("tooManyPlayers");
                        return;
                    } else {
                        client.number = 2;
                        client.join(code);
                        client.emit("codeValid");
                    }
                } else {
                    client.emit("codeInvalid");
                }
                dbclient.close();
            })
        });
    }

    client.on("ready", (player) => {
        if (player == 0) {
            //emit player 1
        } else {
            //emit player 2
        }
    })
});

io.listen(3000);