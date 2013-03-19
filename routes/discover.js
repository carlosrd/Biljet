
/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('discover', { title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};