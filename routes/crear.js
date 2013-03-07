
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('crear', {title: "Crear form"});
};