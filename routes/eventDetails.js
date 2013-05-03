
/*jslint node: true */

"use strict";

/*
 * GET events page.
 */

exports.index = function (req, res) {

    res.render('eventDetails', {
        logged: req.session.logged,
        user: req.session.user,
        id: req.params.id,
        title: 'Biljet :: informacion del evento',
        subtitle: 'informacion del evento'
    });
};