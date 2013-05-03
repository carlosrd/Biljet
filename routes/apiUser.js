
/*jslint node: true */

"use strict";

var mongoose, Schema, db, allSchemas, User;

// MongoDB conection
mongoose = require('mongoose');
Schema = mongoose.Schema;
db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));


allSchemas = require('../models/allSchemas');


User = mongoose.model('User');


exports.save = function (req, res) {
    var name, surname, twitter, facebook, newUser;

    name = req.body.name ? req.body.name : null;
    surname = req.body.surname ? req.body.surname : null;
    twitter = req.body.twitter ? req.body.twitter : null;
    facebook = req.body.facebook ? req.body.facebook : null;

    newUser = new User({
        username: req.body.username,
        name: name,
        surname: surname,
        password: req.body.password,
        email: req.body.email,
        twitter: twitter,
        facebook: facebook,
        lastLogin: new Date().getTime()
    });

    newUser.save(function (err) {
        if (err) {
            res.send(err, 400);
        } else {
            res.send(newUser, 200);
        }
    });
};

exports.list = function (req, res) {
    User.find({})
        .populate('friends')
        .populate('eventsToGo')
        .populate('eventsFollowed')
        .populate('eventsOrganized')
        .populate('qrs')
        .populate('userComments')
        .populate('eventComments')
        .exec(function (err, users) {
            if (err) {
                res.send(err, 400);
            } else {
                res.send(users, 200);
            }
        });
};

exports.findById = function (req, res) {
    User.findOne({_id: req.params.id})
        .populate('friends')
        .populate('eventsToGo')
        .populate('eventsFollowed')
        .populate('eventsOrganized')
        .populate('qrs')
        .populate('userComments')
        .populate('eventComments')
        .exec(function (err, user) {
            if (err) {
                res.send(err, 400);
            } else if (user === null) {
                res.send("[]", 200);
            } else {
                res.send(user, 200);
            }
        });
};

exports.findByUsername = function (req, res) {
    User.findOne({username: req.params.username})
        .populate('friends')
        .populate('eventsToGo')
        .populate('eventsFollowed')
        .populate('eventsOrganized')
        .populate('qrs')
        .populate('userComments')
        .populate('eventComments')
        .exec(function (err, user) {
            if (err) {
                res.send(err, 400);
            } else if (user === null) {
                res.send("[]", 200);
            } else {
                res.send(user, 200);
            }
        });
};

exports.delete = function (req, res) {
    User.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.send(err, 400);
        } else {
            res.send("", 200);
        }
    });
};

exports.login = function (req, res) {
    User.findOne({username: req.body.username})
        .exec(function (err, user) {
            if (user !== null && user.password === req.body.password) {
                req.session.user = {};
                req.session.user.username = user.username;
                req.session.user._id = user._id;
                req.session.user.password = user.password;
                req.session.logged = true;
                res.send(user, 200);
            } else {
                res.send("", 401);
            }
        });
};

exports.logout = function (req, res) {
    req.session.user.username = null;
    req.session.user._id = null;
    req.session.user.password = null;
    req.session.logged = false;
    res.redirect('back');
};

exports.signup = function (req, res) {
    res.render('signup', {
        logged: req.session.logged,
        user: req.session.user,
        error: 'false'
    });
};
