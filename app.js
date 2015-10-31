
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

app.get('/gps/:g_name', routes.index);
app.get('/login', routes.login);
//app.listen(process.env.PORT || 5000, function(){
app.listen(5000, function(){
//  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// DB

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String,
	adress: String,
	g_name:String,
	lat:  Number,
	long: Number
});
mongoose.model('User',UserSchema);
mongoose.connect('mongodb://heroku_v3c4ltwb:8ghrf2ab8jloedkb8nj7ti2ha6@ds045604.mongolab.com:45604/heroku_v3c4ltwb');
var User = mongoose.model('User');

//socket
var io = require('socket.io').listen(app);
if(process.env.XHR){
	console.log("use xhr-polling");
	io.configure(function(){
		io.set('transports', ['xhr-polling']);
		io.set('polling duration', 10);
		});
}

io.sockets.on('connection', function (socket) {
	socket.on('login send',function(doc){
		socket.join(doc.g_name);
		User.findOne({name:doc.name,adress:doc.adress,g_name:doc.g_name},function(err,memo){
		//あったら更新、なかったら登録
		if (err||memo == null){
			//登録
			var user =new User();
			user.name = doc.name;
			user.adress = doc.adress;
                        user.g_name = doc.g_name;
			user.save(function(err){
				if (err){console.log(err)}
		   });
		}
		});
	});
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

     	　　　　client.get('g_name', function(err, _room) {
	                   g_name = _g_name;
			 });
              　 client.get('name', function(err, _name) {
		           name = _name;
			});

		User.findOne({u_id:msg.u_id},function(err,memo){
		//あったら更新、なかったら登録
		if (err||memo == null){
			socket.emit('msg push', msg);
			socket.broadcast.emit('msg push', msg);
			//登録
			var user =new User();
			user.adress = msg.adress;
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
		User.remove({adress: drop_user.adress})
		User.remove({adress: drop_user.adress }, function(err, result){
			    if (err) {
				    console.log('remove error');
				    } else {
					    console.log('Success: ' + result + ' document(s) deleted');
					    }
			    });
		});
	 //セッションの切断
	socket.on('disconnect', function() {
		console.log('disconnected');});
});
