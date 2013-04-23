/*
 * GET events page.
 */

exports.index = function(req, res){
    res.render('eventInformation', { user: req.session.user, title: 'Biljet :: informacion del evento', subtitle: 'informacion del evento' });
};