/*
 * GET events page.
 */

exports.index = function(req, res){
	res.render('maptest', { 
        logged: req.session.logged,
        user: req.session.user,
        title: 'Biljet :: mapaPrueba',
        subtitle: 'mapa prueba'
    });
};