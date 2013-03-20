
/*
 * GET calendar.
 */

exports.index = function(req, res){
    res.render('calendar',{ title: 'Biljet :: calendario', subtitle: 'calendario' });
};