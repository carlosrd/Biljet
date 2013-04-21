
/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('discover', { username: req.session.username, title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};