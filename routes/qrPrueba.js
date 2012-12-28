
/*
 * GET qrPrueba page.
 */

exports.index = function(req, res){
  res.render('qrPrueba', { title: 'Biljet :: qrPrueba', subtitle: 'qr prueba' });
};