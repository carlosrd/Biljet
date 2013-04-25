
/*
 * GET users listing.
 */

exports.login  = function(req, res){
    res.render('login', { 
        logged: req.session.logged,
        user: req.session.user,
        error: false
    });
};