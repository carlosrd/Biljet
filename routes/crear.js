
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('crear', { title: 'Biljet :: Crear Evento', subtitle: 'Crear Evento section' });
};