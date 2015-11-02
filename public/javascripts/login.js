//ログイン画面
var socket = io.connect();
$(function() {
	socket.on('connect', function() {
		console.log('login connect');
	});

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
