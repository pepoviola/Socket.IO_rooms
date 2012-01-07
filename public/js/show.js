
/*IO*/
/*get the ns*/
var ns = location.search.split('?ns=')[1];
var socket = io.connect('http://localhost:8000');
socket.emit('connectMeToRoom',{uuid:ns});
socket.on('tweet', function(data,tw) { 
    var words = data.split(" ");   
    var incLeft = Math.floor(WIDTH / words.length);
    var incTop = 0;

    for (var i=0; i<words.length; i++)
    {
	if(words[i]!==''){
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
    socket.emit('resetStream',{ns:ns});
	location.replace('/');
}
