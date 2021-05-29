var app = require('express')();
var server = require('http').Server(app);

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://admin:Nyancat12!@172.105.0.175:27017';
const dbName = 'tetris';

const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', client => {
    client.emit('init', { data: 'hello world' })
    client.on("privateCode", () => {
        MongoClient.connect(url, (err, dbclient) => {
            const db = dbclient.db(dbName);
            const codeCollection = db.collection('code');
            const code = Math.floor(Math.random() * 1000000);
            codeCollection.findOne({ code: code }, (err, res) => {
                if (err) throw err;
                if (res == null || res == undefined || res.length == 0) {
                    codeCollection.insertOne({ code: code }, (err, res) => {
                        if (err) throw err;
                        console.log("Successful", code);
                        client.emit('returnPrivateCode', code);
                    })

                }
                dbclient.close()
            })

        })
    })
});



io.listen(3000);