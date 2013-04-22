// MongoDB conection
var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));


var allSchemas = require('../models/allSchemas');


var User = mongoose.model('User');


exports.save = function(req, res){
    var name = req.body.name ? req.body.name : null;
    var surname = req.body.surname ? req.body.surname : null;
    var twitter = req.body.twitter ? req.body.twitter : null;
    var facebook = req.body.facebook ? req.body.facebook : null;

    var passwordHash = crypto.createHash('md5').update(req.body.password).digest("hex");

    var newUser = new User({
        username: req.body.username,
        name: name,
        surname: surname,
        password: passwordHash,
        email: req.body.email,
        twitter: twitter,
        facebook: facebook,
        lastLogin: new Date().getTime()
    });

    newUser.save (function (err) {
        if (err) {
            res.send(err, 500);
        } else {
            res.send(newUser, 200);
        }
    });
};

exports.list = function(req, res) {
    User.find({})
        .populate('friends')
        .populate('eventsToGo')
        .populate('eventsFollowed')
        .populate('eventsOrganized')
        .populate('qrs')
        .populate('userComments')
        .populate('eventComments')
        .exec( function (err, users) {
            if (err) {
                res.send(err, 500);
            } else {
                res.send(users, 200);
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
        .exec( function (err, user) {
            if (err) {
                res.send(err, 500);
            } else if (user === null){
                res.send("[]", 200);
            } else {
                res.send(user, 200);
            }
        });
};

exports.delete = function (req, res) {
    User.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.send(err, 500);
        } else {
            res.send("", 200);
        }
    });
}

exports.login = function (req, res) {
    User.findOne({username: req.body.username})
    .exec( function (err, user) {
        if (user !== null && user.password === req.body.password) {
            req.session.user = {};
            req.session.user.username = user.username;
            req.session.user._id = user._id;
            console.log(req.session, "session: ");
            res.send(user, 200);
        } else {
            res.send("", 401);
        }
    });
}

exports.logout = function (req, res) {
    delete req.session.user;
    res.redirect('back');
}

exports.signup = function (req, res) {
    res.render('signup', { username: req.session.user.username, error: 'false'});
}
