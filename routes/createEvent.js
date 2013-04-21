
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('createEvent', {username: req.session.username, title: "Crear form"});
};