var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var User = new Schema({
        username: String,
        name: String,
        surname: String,
        password: String,
        avatar: String,
        avatarFilename: String,
        email: String,
        twitter: String,
        twitterOAuthToken: String,
        twitterOAuthTokenSecret: String,
        facebook: String,
        facebookOAuthToken: String,
        enabled: String,
        lastLogin: Number,
        friends: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        eventsToGo: { 
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },

        eventsFollowed: { 
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        eventsOrganized: { 
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        qrs: { 
            type: Schema.Types.ObjectId,
            ref: 'QR'
        },
        userComments: { 
            type: Schema.Types.ObjectId,
            ref: 'UserComment'
        },
        eventComments: { 
            type: Schema.Types.ObjectId,
            ref: 'EventComment'
        }
    });

    mongoose.model('User', User);
};