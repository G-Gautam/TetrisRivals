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
    client.on("privateCode", () => {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            const code = Math.floor(Math.random() * 1000000);
            codeCollection.findOne({ id: code }, (err, res) => {
                if (err) throw err;
                if (res == null || res == undefined) {
                    codeCollection.insertOne({ id: code }, (err, res) => {
                        if (err) throw err;
                        console.log("Successful", code);
                        state[id] = createGameState();
                        client.emit('returnPrivateCode', code);
                    })
                } else {
                    client.emit('retryCode')
                }
                dbclient.close()
            })

        })
    })
    client.on("checkCode", (arg) => {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection(collectionName);
            codeCollection.findOne({ id: parseInt(arg) }, (err, res) => {
                if (err) throw err;
                if (res != null) {
                    client.emit("codeValid", arg);
                } else {
                    client.emit("codeInvalid");
                }
                dbclient.close();
            })
        });
    });

    client.on("ready", (player) => {
        if (player == 0) {
            //emit player 1
        } else {
            //emit player 2
        }
    })
});

io.listen(3000);