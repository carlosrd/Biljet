/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('qrtest', {
        username: req.session.user,
        title: 'Biljet :: Prueba qr',
        subtitle: 'Prueba qr'
    });
};