
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

app.get('/gps/:room', routes.index);
app.get('/login', routes.login);
app.get('/test', routes.gps);
app.listen(process.env.PORT || 5000, function(){
});

// DB

var Schema = mongoose.Schema;
var UserSchema = new Schema({
	name: String,
	address: String,
	room:String,
	lat:  Number,
	long: Number
});
mongoose.model('User',UserSchema);
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost', function(err){
	  if(err){
		  console.error(err);
		  process.exit(1);
		  }
});
var User = mongoose.model('User');
console.log("aaaa"+process.env.MONGOLAB_URI);
//socket
var io = require('socket.io').listen(app);
/**if(process.env.XHR){
	console.log("use xhr-polling");
	io.configure(function(){
		io.set('transports', ['xhr-polling']);
		io.set('polling duration', 10);
		});
}
**/
io.sockets.on('connection', function (socket) {
	console.log("socket.io  OK");
	//部屋の作成
	socket.on('create room',function(doc){
		console.log("hello heroku");
		User.findOne({room:doc.room},function(err,memo){
		//あったらfalseを送る
		if (err||memo == null){
			//登録
			var user =new User();
			user.name = doc.name;
			user.address = doc.address;
                        user.room = doc.room;
			user.save(function(err){
				if (err){console.log(err)}
		   });
			socket.emit('msg tf','true');
		}
		else{
			socket.emit('msg tf','false');
		}
		});
		socket.set('room', doc.room);
		socket.set('name', doc.address);
		// ※4 クライアントを部屋に入室させる
		socket.join(doc.room);
	});

	//部屋に入る
	socket.on('enter room',function(doc){
		User.findOne({room:doc.room},function(err,memo){
		//あったら登録し部屋に入れる
		if (memo != null){
		//登録
			var user =new User();
			user.name = doc.name;
			user.address = doc.address;
                        user.room = doc.room;
			user.save(function(err){
				if (err){console.log(err)}
		   });	
		socket.set('room', doc.room);
		socket.set('name', doc.address);		
		socket.join(doc.room);
		}
		else{
			socket.emit('msg tf','false');
		}
		});
	});


/**	//接続された際データベースにあるデータをクライアントに送る
	socket.on('msg update',function(){
		User.find(function(err,docs){
			socket.emit('msg open',docs);
			});
	});
	**/
	//接続の確認
	console.log('connected');

	//新規データが送られてきたらデータベースの確認
	socket.on('msg send', function (msg) {
		var room, name;
     	　　　　socket.get('room', function(err, _room) {
	                   room = _room;
			 });
              　socket.get('name', function(err, _name) {
		           name = _name;
			});
		User.findOne({address:msg.address,room:msg.room},function(err,memo){
		//あったら更新、なかったら登録
		if (err||memo == null){
			socket.to(room).emit('msg push', msg);
			//登録
			var user =new User();
			user.address = msg.address;
			user.name = msg.name;
                        user.room = msg.room;
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
			User.find({room:msg.room},function(err,docs){
				socket.to(room).emit('msg open',docs)
				});
			}
			});
		});
	//DBにあるメッセージを削除
	socket.on('deleteDB', function(drop_user){
		       var room, name;
		       socket.get('room', function(err, _room) {
			       room = _room;
			       });
		       socket.get('name', function(err, _name) {
			       name = _name;
			       });
			User.remove({address: drop_user.address }, function(err, result){
			    if (err) {
				    console.log('remove error');
				    } else {
					    console.log('Success: ' + result + ' document(s) deleted');
					    }
			    });
			User.find({room: drop_user.room},function(err,docs){
				socket.to(room).emit('msg open',docs)
			});
	

		});
	 //セッションの切断
	socket.on('disconnect', function() {
		       var room, name;
		       socket.get('room', function(err, _room) {
			       room = _room;
			       });
		       socket.get('name', function(err, _name) {
			       name = _name;
			       });
		       socket.leave(room);
		console.log('disconnected');});
});
