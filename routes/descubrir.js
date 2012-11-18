
/*
 * GET eventos page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Biljet :: Descubrir Eventos' });
};