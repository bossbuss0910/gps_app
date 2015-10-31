//クライアント
//
var socket = io.connect();
//var socket = new io.Socket();
//socket.connect();

$(function() {
	socket.on('connect', function() { 
		console.log('successfully sent');
		socket.emit('msg update');
	});

	
	$('#btn').click(function() {
		var address = $('#address');
		var name = $('#name');	 
		var room = $('#room');
		var lat = $('#lat');
		var long = $('#long');
		socket.emit('msg send', {address:address.val(),name:name.val(),room:room.val(),lat:lat.val(),long:long.val()});
	});

	$('#delete').click(function(){
		var address = $('#address');
		var room = $('#room');
		socket.emit('deleteDB',{address:address.val(),room:room.val()});
		})

	socket.on('msg push', function (msg) {
		console.log(msg);
		$('#list').prepend($('<dt>' + msg.name + '</dt><dd>' + msg.lat + '</dd>'+'<dd>'+msg.long+'</dd>'));
	});
	
	socket.on('msg open', function(msg){
		console.log(msg);
		//DBが空っぽだったら
		if(msg.length == 0){
			return;
			} else {
				$('#list').empty();
				$.each(msg, function(key, value){
					$('#list').prepend($('<dt>' + value.name + '</dt><dd>' + value.lat + '</dd>'+'<dd>'+value.long+'</dd>'));
					});   
				}
			});

	socket.on('db drop', function(msg){
//		 $('#list').empty();
	});
});
