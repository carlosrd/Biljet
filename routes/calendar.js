
/*
 * GET calendar.
 */

exports.index = function(req, res){
    res.render('calendar', {
        user: req.session.user,
        title: 'Biljet :: calendario',
        subtitle: 'calendario'
    });
};