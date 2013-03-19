
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('createEvent', {title: "Crear form"});
};