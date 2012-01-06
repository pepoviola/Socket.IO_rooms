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

var words = [];
var Track = function(word,room){
	/*
    * have to check if the word is already tracked
    * if the word is not in words add to
    * if the word is in words, and the room is not set
    * add the room to the word
    */
	var toTrack = new Object();
	toTrack.word = word;
    toTrack.room = room;
	//toTrack.rooms = [];
    //toTrack.rooms.push(room);
    /*check if word is in words*/
    for(var i = 0; i < words.length;i++){
        for(var keyword in words[i]){
            if(keyword==toTrack.word){
                words[keyword].push(toTrack.room);
                }            
            }    
    }
    //words is not in words...
    //words.push({toTrack.word:[toTrack.room]});	
	return toTrack;
	}
	
/**
 * Filter manager
 * =============
 * 
 * Get the tweets and filter for looking for the keyword
 * Then send the tweet to the rooms
 * 
 * */
   

function inspectTweet(tweet){
    
    for(var i = 0; i < words.length;i++){
        for(var keyword in words[i]){
            var reg = new RegExp(keyword,"i");
            if(reg.test(tweet.text)){
                /**
                * send the keyword and the tweet
                **/
                sendTrend(words[keyword],keyword,tweet);                
            }
        }        
    }
}
 
 /**
  *  Send Manager
  * @objTrend  trend Object -> {keyword:[rooms]}
  * @keyword  String 
  * @tweet Tweet Object
  * 
  * */
 function sendTrend(objTrend,keyword,tweet){
     
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
