
/*
 * GET calendar.
 */

exports.index = function(req, res){
    res.render('calendar', {
        logged: req.session.logged,
        user: req.session.user,
        title: 'Biljet :: calendario',
        subtitle: 'calendario'
    });
};