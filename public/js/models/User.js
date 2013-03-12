var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var UserSchema = new Schema({
        username: { type: String, required, unique },
        name: { type: String, default: null },
        surname: { type: String, default: null },
        password: { type: String, required, unique },
        avatar: { type: String, default: null },
        avatarFilename: { type: String, default: null },
        email: {type: String, required, unique },
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
};