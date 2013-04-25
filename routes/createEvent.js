
/*
 * GET crear page.
 */

exports.index = function(req, res){
    res.render('createEvent', {
    logged: req.session.logged,
    user: req.session.user, title: "Crea un nuevo evento"});
};