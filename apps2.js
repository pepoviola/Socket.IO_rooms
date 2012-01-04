var app = require('express').createServer(),   
    io = require('socket.io').listen(app);


io.configure( function(){
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
	io.set('transports', [                     // enable all transports (optional if you want flashsocket)
	  'websocket',
	   'flashsocket',
	   'htmlfile',
	   'xhr-polling',
	   'jsonp-polling'
	]);
});

app.listen(8000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


/**
 * this is the track manager
 * we get the of the room for every word tracked
 * 
 * */

var tracked = [];
var Track = function(word,room){
        this.word = word,
        this.RoomsInstance = room
        tracked.push(this);
        }
        
        
 
var buffer = [];

io.sockets.on('connection', function(client){
	var Room = "";
    client.on("setNickAndRoom", function(nick, fn){
	fn({msg : "Hello " + nick.nick});
	client.join(nick.room);
	Room = nick.room;
    var track = new Track(nick.nick,Room);
    console.log(track);
	//console.log(client);
	client.broadcast.to(Room).json.send({ msg: "Se conecto al room: " + nick.room, nick : nick.nick });
    });

    client.on('message', function(message, fn){
        var msg = message; //{ message: [client.sessionId, message] };
        buffer.push(msg);
        if (buffer.length > 15)
		buffer.shift();
        client.broadcast.to(Room).json.send(msg);
        fn(msg);
    });

    client.on('disconnect', function(){
	client.broadcast.to(Room).json.send({ msg: "Se desconecto"});
    });
    
});


