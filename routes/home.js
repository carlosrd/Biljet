
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log(req.session, "session: ");
    res.render('home', {user: req.session.user});
};