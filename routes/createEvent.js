
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('createEvent', {user: req.session.user, title: "Crear form"});
};