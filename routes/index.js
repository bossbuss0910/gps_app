
/*
 * GET home page.
 */

exports.index = function(req, res){
	g_name=req.params.g_name;
	res.render('gps', { title: 'gps_app',g_name:g_name.val() });
};


//ログイン画面

exports.login = function(req,res){
	res.render('login',{title:'login'});
 };
