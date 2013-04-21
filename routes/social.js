
/*
 * GET social page.
 */

exports.index = function(req, res){
    res.render('social', { username: req.session.username, title: 'Biljet :: Social', subtitle: 'Social section' });
};