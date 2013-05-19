"use strict";

/*
 * GET example page.
 */

exports.index = function (req, res) {
    res.render('example', {
        logged: req.session.logged,
        user: req.session.user,
        title: "Example page"
    });
};