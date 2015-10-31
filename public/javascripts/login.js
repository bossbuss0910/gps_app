//ログイン画面
$(function() {

	var socket = io.connect(location.origin);
//	var socket = new io.Socket();
//	socket.connect();
	$('#btn').click(function() {
		var name = $('#name');
		var address = $('#address');
		var room = $('#room');
		socket.emit('enter room', {name:name.val(),address:address.val(),room:room.val()});
	});

	$('#create').click(function() {
		var name = $('#name');
		var address = $('#address');
		var room = $('#room');
		socket.emit('create room', {name:name.val(),address:address.val(),room:room.val()});
	});
});
