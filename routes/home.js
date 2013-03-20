
/*
 * GET home page.
 */

exports.index = function(req, res){
    if (! req.user) {
        res.render('home', {username: null});
    } else {
        res.render('home', {username: req.user});
    }
};