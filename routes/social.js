
/*
 * GET social page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Biljet :: Social' });
};