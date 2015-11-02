//ログイン画面
var socket = io.connect("https://gps-app-meet.herokuapp.com/");
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
