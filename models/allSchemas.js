var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var eventSchema = new Schema({
    title: { type: String, unique: true, required: true },
    finishAt: { type: Number, default: null },
    createdAt: Number,
    duration: { type: Number, default: null },
    price: {type: Number, required: true },
    creator: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendee: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }],
    province: { type: String, required: true },
    postalCode: {type: Number, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    address: { type: String, default: null },
    category: { type: String, required: true },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'EventComment',
        default: null
    }],
    imageName: { type: String, default: 'eventDefault.png' },
    description: { type: String,required: true }
});



var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    name: { type: String, default: null },
    surname: { type: String, default: null },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    avatarFilename: { type: String, default: null },
    email: {type: String, required: true, unique: true },
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


userSchema.methods.validPassword = function (pass) {
  return this.password === pass;
}


var qrSchema = new Schema({
    username: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: String,
    path: String,
    event: { 
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
});



var eventCommentSchema = new Schema({
    username: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Number,
    text: String
});



var userCommentSchema = new Schema({
    username: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: Number,
    text: String
});



mongoose.model('User', userSchema);
mongoose.model('Event', eventSchema);
mongoose.model('QR', qrSchema);
mongoose.model('EventComment', eventCommentSchema);
mongoose.model('UserComment', userCommentSchema);
