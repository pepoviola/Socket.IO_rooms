
/*IO*/
/*get the ns*/
var ns = location.search.split('?ns=')[1];
alert(ns);

//var socket = new io.Socket('http://upmobile:3000');
//socket.connect();
//var socket = io.connect('http://upmobile.com.ar:8082');
//var socket = io.connect('http://tw.pepoviola.c9.io/'+ns);
//  socket.on('news', function (data) {
//    //console.log(data);
//    socket.emit('my other event', { my: 'data' });
//  });

  var ns_socket;
  var socket = io.connect('http://tw.pepoviola.c9.io');
   socket.emit('joinDynNs', ns, function(data){
  console.log(data);
  ns_socket = io.connect('http://tw.pepoviola.c9.io/' + ns);
  ns_socket.on('c',function(){
      console.log('joined namespace ' + data.namespace);
      });
  
}); 


  socket.on('log',function(t){
    console.log(t);
    });

//socket.on('connect', function(){
    // do something when client connects
//});

//socket.on('ns_to',function(data){
//    alert(data);
//    });
    
socket.on('tweet', function(data,tw) { 
    //alert('pepo');
    //var words = data.text.split(" ");
    var words = data.split(" ");   
    var incLeft = Math.floor(WIDTH / words.length);
    var incTop = 0;

    for (var i=0; i<words.length; i++)
    {
	if(words[i]!=''){
        var left = i * incLeft;
        var top = i * incTop - 100;
        //veo si esta
        var toLeft = $('.'+words[i]).css('left');
        if(toLeft !== undefined){
        	left = parseInt(toLeft)+10;
        	}
        var div = $("<div></div>")
            //.html(words[i])
            .html('')
            .addClass('word')
            .css({left: left, top: top});

        animationStack.pushElement(div);
        wordGraph.pushWord(words[i]);

        $("#wrapper").append(div);
        if($("#tweet").children().length>=4){
		var el = $("#tweet").children()[4];
		$(el).remove();
		$("#tweet").prepend(renderTweet(tw));
		}
	else{
	        $("#tweet").prepend(renderTweet(tw));
	}

	}//del if 
    }
});


//reset the stream
function resetStream(){
    socket.emit('resetStream');
	location.replace('/');
}
