
/*
 * GET home page.
 */

exports.index = function(req, res){
    console.log(req.session, "session: ");
    res.render('home', {username: req.session.username});
};