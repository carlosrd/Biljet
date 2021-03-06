
/*jslint node: true */

"use strict";


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
    city: { type: String, required: true },
    place: { type: String, default: null },
    province: { type: Number, required: true },
    postalCode: {type: Number, required: true },
    address: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    category: { type: String, required: true },
    imageName: { type: String, default: 'eventDefault.png' },
    description: { type: String, required: true },
    capacity: { type: Number, required: true }
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
    }]
});


userSchema.methods.validPassword = function (pass) {
    return this.password === pass;
};


var qrSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, required: true },
    //numero de entradas a comprar
    numberTickets: { type: Number, required: true },
    //Saber si el qr ya fue usado
    isUsed: { type: Boolean, default: false },
    path: { type: String, required: true },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    }
});



mongoose.model('User', userSchema);
mongoose.model('Event', eventSchema);
mongoose.model('QR', qrSchema);
