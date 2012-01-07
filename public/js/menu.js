/*get the ns*/
//var ns = location.search.split('?ns=')[1];
//alert(ns);
//var socket = io.connect('http://upmobile.com.ar:8082');
//var socket = io.connect('http://tw.pepoviola.c9.io/');
var socket = io.connect('http://localhost:8000');

  
  socket.on('ns_to',function(ns){
      console.log(ns);
      location.replace('/show?ns='+ns.id);
      });


function post(){
    var toTrack = [];
	//get the inputs
	var inputs = $('input[type="text"]');
	$.each(inputs,function(a,b){
		if(b.value !== ''){
			toTrack.push(b.value);
			}
		});
	console.log(toTrack);
	socket.emit('startStream',{to: toTrack});
}
