
/*jslint node: true */

"use strict";

/*
 * GET home page.
 */

exports.index = function (req, res) {
    console.log(req.session.user, "session: ");

    res.render('home', {
        logged: req.session.logged,
        user: req.session.user
    });
};