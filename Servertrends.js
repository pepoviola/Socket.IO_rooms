var express = require('express');
var app = express.createServer();
var sys         = require('sys');
var io = require('socket.io').listen(app);
var fs = require('fs');
var TwitterNode = require('twitter-node').TwitterNode;
var  PORT = process.env.C9_PORT;
app.listen(PORT);
var user = process.argv[2];
var clave = process.argv[3];

/**
 *
 * APP SETUP 
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
 * twitter
 */

 var twitterStream = new TwitterNode({
      user: user,
      password: clave,
      track: []
  });

  twitterStream.addListener('tweet', function (tweet) {
    var candidato = inspectTweet(tweet);
    if(candidato !== undefined){
        io.sockets.emit('tweet', candidato+" ",tweet);
	}
  });