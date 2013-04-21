
/*
 * GET users listing.
 */

exports.login  = function(req, res){
    res.render('login', { username: req.session.username, error: false });
};