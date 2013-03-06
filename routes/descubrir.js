
/*
 * GET eventos page.
 */

exports.index = function(req, res){
    res.render('descubrir', { title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};