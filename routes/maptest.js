/*
 * GET events page.
 */

exports.index = function(req, res){
	res.render('maptest', { title: 'Biljet :: mapaPrueba', subtitle: 'mapa prueba' });
};