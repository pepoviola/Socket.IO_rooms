/*get the ns*/
//var ns = location.search.split('?ns=')[1];
//alert(ns);
//var socket = io.connect('http://upmobile.com.ar:8082');
var socket = io.connect('http://tw.pepoviola.c9.io/');

  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
  
  socket.on('ns_to',function(ns){
      console.log(ns);
      location.replace('/show?ns='+ns.id);
      });


function post(){
    var toTrack = [];
	//get the inputs
	var inputs = $('input[type="text"]');
	$.each(inputs,function(a,b){
		if(b.value != ''){
			toTrack.push(b.value);
			}
		});
	console.log(toTrack);
	socket.emit('startStream',{to: toTrack});
	//location.replace('/show?ns=pepo');
}
