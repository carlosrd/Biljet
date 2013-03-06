// MongoDB conection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var UserSchema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, default: null },
    surname: { type: String, default: null },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    avatarFilename: { type: String, default: null },
    email: { type: String, unique: true, required: true },
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
    var name = req.body.name ? req.body.name : null;
    var surname = req.body.surname ? req.body.surname : null;
    var twitter = req.body.twitter ? req.body.twitter : null;
    var facebook = req.body.facebook ? req.body.facebook : null;

    var newUser = new User({
        username: req.body.username,
        name: name,
        surname: surname,
        password: req.body.password,
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
