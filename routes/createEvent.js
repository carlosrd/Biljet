
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('createEvent', {username: req.session.user, title: "Crear form"});
};