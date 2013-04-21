
/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('discover', { username: req.session.user, title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};