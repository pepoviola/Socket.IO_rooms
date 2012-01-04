var app = require('express').createServer();
var io = require("socket.io").listen(app);

io.sockets.on('connection', function (socket) {

    // join to room and save the room name
socket.on('join room', function (room) {
    socket.set('room', room, function() { console.log('room ' + room + ' saved'); } );
    socket.join(room);
});

socket.on('message', function(data) {
    console.log("Client data: " + data);

          // lookup room and broadcast to that room
    socket.get('room', function(err, room) {
          //room example - https://github.com/learnboost/socket.io
          // neither method works for me
          socket.broadcast.to(room).emit('new','hello there');
          //io.sockets.in(room).emit('new non-fan');
    });
});
});

app.get('/room1', function(req, res){       
//res.render('client.html', {layout:false});
res.sendfile(__dirname + '/views/index.html');
});

app.get('/room2', function(req, res){       
res.render('client2.ejs', {layout:false});
});

app.listen(4000);
