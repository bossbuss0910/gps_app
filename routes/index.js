
/*
 * GET home page.
 */

exports.index = function(req, res){
	room=req.params.room;
	res.render('gps', { title: 'gps_app'});
};

//ログイン画面

exports.login = function(req,res){
	res.render('login',{title:'login'});
	};

//mapの表示

exports.mapview = function(req,res){
	res.render('map',{title:'mapview'});
	};
