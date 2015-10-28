//クライアント
$(function() {

	var socket = io.connect('http://localhost');
	
	socket.on('connect', function() { 
		console.log('successfully sent');
		socket.emit('msg update');
	});

	
	$('#btn').click(function() {
		var u_id = $('#u_id');
		var name = $('#name');	 
		var g_id = $('#g_id');
		var lat = $('#lat');
		var long = $('#long');
		socket.emit('msg send', {u_id:u_id.val(),name:name.val(),g_id:g_id.val(),lat:lat.val(),long:long.val()});
	});

	$('#delete').click(function(){
		var u_id = $('#u_id');
		var name = $('#name');
		socket.emit('deleteDB',{id:u_id.val(),name:name.val()});
		})

	socket.on('msg push', function (msg) {
//		console.log(msg);
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
