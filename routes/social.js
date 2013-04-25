
/*
 * GET social page.
 */

exports.index = function(req, res){
    res.render('social', {
        logged: req.session.logged,
        user: req.session.user,
        title: 'Biljet :: Social',
        subtitle: 'Social section'
    });
};