/*
 * GET events page.
 */

exports.index = function(req, res){

    res.render('eventDetails', {
        user: req.session.user,
        id: req.params.id,
        title: 'Biljet :: informacion del evento',
        subtitle: 'informacion del evento'
    });
};