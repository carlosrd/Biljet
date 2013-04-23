
/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('discover', { user: req.session.user, title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};