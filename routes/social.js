
/*
 * GET social page.
 */

exports.index = function(req, res){
  res.render('social', { title: 'Biljet :: Social', subtitle: 'Social section' });
};