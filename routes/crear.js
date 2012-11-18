
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Biljet :: Crear Evento' });
};