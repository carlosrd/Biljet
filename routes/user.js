
/*
 * GET users listing.
 */

exports.login  = function(req, res){
    res.render('login', { user: req.session.user, error: false });
};