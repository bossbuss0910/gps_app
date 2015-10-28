
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/gps', routes.index);
app.get('/login', routes.login);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// DB

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	u_id: Number, 
	name: String,
	g_id: Number,
	lat:  Number,
	long: Number
});
mongoose.model('User',UserSchema);
mongoose.connect('mongodb://localhost/gps_app');
var User = mongoose.model('User');

//socket
var io = require('socket.io').listen(app);
io.sockets.on('connection', function (socket) {
	//接続された際データベースにあるデータをクライアントに送る
	socket.on('msg update',function(){
		User.find(function(err,docs){
			socket.emit('msg open',docs);
			});
	});
	//接続の確認
	console.log('connected');
	//新規データが送られてきたらデータベースの確認
	socket.on('msg send', function (msg) {
		User.findOne({u_id:msg.u_id},function(err,memo){
		//あったら更新、なかったら登録
		if (err||memo == null){
			socket.emit('msg push', msg);
			socket.broadcast.emit('msg push', msg);
			//登録
			var user =new User();
			user.u_id = msg.u_id;
			user.name = msg.name;
                        user.g_id = msg.g_id;
			user.lat = msg.lat;
			user.long = msg.long;
			user.save(function(err){
				if (err){console.log(err)}
		   });
		}
		else{
			//更新
			memo.lat=msg.lat;
			memo.long=msg.long;
			memo.save();
			User.find(function(err,docs){
				socket.emit('msg open',docs)
				});
			}
			});
		});
	//DBにあるメッセージを削除
	socket.on('deleteDB', function(drop_user){
		User.find(function(err,docs){
			socket.emit('msg open',docs)
			});
		User.remove({u_id: drop_user.id})
		User.remove({ u_id: drop_user.id }, function(err, result){
			    if (err) {
				    res.send({'error': 'An error has occurred - ' + err});
				    } else {
					    console.log('Success: ' + result + ' document(s) deleted');
					    }
			    });
		});
	 //セッションの切断
	socket.on('disconnect', function() {
		console.log('disconnected');});
});
