
/*jslint node: true */

"use strict";

/*
 * GET events page.
 */

exports.index = function (req, res) {
    res.render('discover', {
        logged: req.session.logged,
        user: req.session.user,
        title: 'Biljet :: Descubrir Eventos',
        subtitle: 'Descubrir Eventos section'
    });
};