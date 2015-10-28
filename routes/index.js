
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('layout', { title: 'gps_app' });
};


//ログイン画面

exports.login = function(req,res){
 res.render('login');
 };
