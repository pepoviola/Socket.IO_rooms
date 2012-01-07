/**
* 
* Modules
*
*/
var express = require('express');
var app = express.createServer();
var sys         = require('sys');
var io = require('socket.io').listen(app);
var fs = require('fs');
var TwitterNode = require('twitter-node').TwitterNode;
//var  PORT = process.env.C9_PORT;
app.listen(8000);
var user = process.argv[2];
var clave = process.argv[3];

/*
 * IO consfigure
 */
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

/**
 *
 * APP SETUP 
 * 
 **/
app.configure(function(){
  app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  app.set('view engine', 'haml');
  app.register('.haml', require('hamljs'));
});

app.get('/', function(req, res){
  res.render('index', {
    locals: {title: 'Trends'}
  });
});
app.get('/show', function(req, res){
  res.render('show', {
    locals: {
        title: 'Trends Show',
        ns: req.query.ns 
        }
  });
});

/**
 * Helpers Zone
 *
 *  TrackManager
 *  NameSpace creator
 */


/**
 * this is the track manager
 * we get the of the room for every word tracked
 * 
 * */

var words = [];
var tracks = [];
var Track = function(word,room){
	/*
    * have to check if the word is already tracked
    * if the word is not in words add to
    * if the word is in words, and the room is not set
    * add the room to the word
    */
	var toTrack = {};
	toTrack.word = word;
    toTrack.room = room;
	//toTrack.rooms = [];
    //toTrack.rooms.push(room);
    /*check if word is in words*/
	var inWords = false;
    for(var i = 0; i < words.length;i++){
        for(var keyword in words[i]){
            if(keyword==toTrack.word){
				//word is in words... add the room
                words[i][keyword].push(toTrack.room);
				inWords = true;
                }            
            }    
    }
	if(!(inWords)){
		//words is not in words...
		// add to words and to twitterTrack
		var literal = {};
		literal[toTrack.word] = [toTrack.room];
		words.push(literal);
		tracks.push(toTrack.word);
		twitterStream.track(tracks);
		
	}
	return toTrack;
	};


/* NameSpaces (aka Rooms) */
var ns_queue = [];
function createNamespace(){
    var ns = {
         id: require('node-uuid')(),
         clients: 0 
       };
    ns_queue.push(ns);
    return ns;
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
                sendTrend(words[i][keyword],keyword,tweet);                
            }
        }        
    }
}
 
 /**
  *  Send Manager
  * @rooms Array of rooms  [rooms]
  * @keyword  String 
  * @tweet Tweet Object
  * 
  * */
 function sendTrend(rooms,keyword,tweet){
	for(var i=0; i<rooms.length; i++){
		io.sockets.socket().broadcast.to(rooms[i]).emit('tweet', keyword+" ",tweet);
		//console.log(rooms[i]);
		}
     }


/**
 *
 * Socket IO
 *
 */
io.sockets.on('connection', function(client){
	var Room = "";
    client.on("startStream", function(WordToTrack){
	//create the room and join
	var ns_uuid = createNamespace();
	//client.join(ns_uuid.id);
	Room = ns_uuid.id;	
	/*add search words to Track manager */
	for(var i=0;i<WordToTrack.to.length;i++){
			var track = new Track(WordToTrack.to[i],Room);
		}
	client.emit('ns_to',ns_uuid);
	/*stream*/
	twitterStream.stream();
	});
	client.on("connectMeToRoom", function(room){
		client.join(room.uuid);
	});
	
});






/**
 * twitter
 */

 var twitterStream = new TwitterNode({
      user: user,
      password: clave,
      track: []
  });

  twitterStream.addListener('tweet', function (tweet) {
    inspectTweet(tweet);
  });