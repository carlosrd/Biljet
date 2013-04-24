
/*
 * GET crear page.
 */

exports.index = function(req, res){
  res.render('createEvent', {user: req.session.user, title: "Crea un nuevo evento"});
};