//ログイン画面
$(function() {

	var socket = io.connect('http://localhost');
	
	$('#btn').click(function() {
		var name = $('#name');
		var adress = $('#adress');
		var g_name = $('#g_name');
		socket.emit('login send', {name:name.val(),adress:adress.val(),g_name:g_name.val()});
	});
});
