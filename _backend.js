var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'dist')));


app.get('/', (req,res) => {
    res.sendFile(__dirname+'/dist/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 3000,() => {
    console.log('🚀 Launched on port: '+ server.address().port);
});

io.on('connection', socket => {

    socket.on('newplayer', () => {

        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };

        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('movementKey', direction => {
            switch(direction) {
                case 'down':
                    socket.player.y += 5;
                    break;
                case 'up':
                    socket.player.y -= 5;
                    break;
                case 'right':
                    socket.player.x += 5;
                    break;
                case 'left':
                    socket.player.x -= 5;
                    break;
            }
            io.emit('move',socket.player);
        });

        socket.on('disconnect', () => {
            io.emit('remove',socket.player);
        });
    });

    socket.on('test',() => {
        console.log('✨ Test reveived!');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).map(socketID => {
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
