
/*
 * GET social page.
 */

exports.index = function(req, res){
    res.render('social', {
        user: req.session.user,
        title: 'Biljet :: Social',
        subtitle: 'Social section'
    });
};