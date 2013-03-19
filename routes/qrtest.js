/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('qrtest', { title: 'Biljet :: Prueba qr', subtitle: 'Prueba qr' });
};