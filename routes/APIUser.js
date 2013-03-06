// MongoDB conection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var UserSchema = new Schema({
    username: { type: String, unique: true },
    name: { type: String, default: null },
    surname: { type: String, default: null },
    password: String,
    avatar: { type: String, default: null },
    avatarFilename: { type: String, default: null },
    email: String,
    twitter: { type: String, default: null },
    twitterOAuthToken: { type: String, default: null },
    twitterOAuthTokenSecret: { type: String, default: null },
    facebook: { type: String, default: null },
    facebookOAuthToken: { type: String, default: null },
    enabled: { type: Boolean, default: true },
    lastLogin: Number,
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    eventsToGo: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    }],

    eventsFollowed: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    }],
    eventsOrganized: [{
        type: Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    }],
    qrs: [{
        type: Schema.Types.ObjectId,
        ref: 'QR',
        default: null
    }],
    userComments: [{
        type: Schema.Types.ObjectId,
        ref: 'UserComment',
        default: null
    }],
    eventComments: [{
        type: Schema.Types.ObjectId,
        ref: 'EventComment',
        default: null
    }]
});

var User = mongoose.model('User', UserSchema);

exports.save = function(req, res){
    var username = req.body.username ? req.body.username : null;
    var name = req.body.name ? req.body.name : null;
    var surname = req.body.surname ? req.body.surname : null;
    var email  = req.body.email ? req.body.email : null;
    var twitter = req.body.twitter ? req.body.twitter : null;
    var facebook = req.body.facebook ? req.body.facebook : null;

    var raul = new User({
        username: username,
        name: name,
        surname: surname,
        password: 12351,
        email: email,
        twitter: twitter,
        facebook: facebook,
        lastLogin: 1234456676
    });

    raul.save (function (err) {
        if (err) {
            User.findOne({username: raul.username}, function (err, user) {        
                if (err) {
                    res.send("[POST - /api/user] Error on MongoDB: unknown", 500);
                } else if (user === null) {
                    res.send("[POST - /api/user] Error on MongoDB: unknown", 500);
                } else {
                    res.send("[POST - /api/user] Error on MongoDB: username taken", 500);
                }
            });
        } else {
            res.send(raul, 200);
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
                res.send("[GET - /api/user] Error on MongoDB: unknown", 500);
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
                res.send("[GET - /api/user/{username} Error on MongoDB: unknown", 500);
            } else if (user === null){
                res.send("[]", 200);
            } else {
                res.send(user, 200);
            }
        });
};
