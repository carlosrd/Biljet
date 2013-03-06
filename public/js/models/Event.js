var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var Event = new Schema({
        name: String,
        date: Number,
        price: Number,
        creator: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        peopleFollow: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        peopleSignup: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        province: String,
        latitude: Number,
        longitude: Number,
        comments: {
            type: Schema.Types.ObjectId,
            ref: 'EventComment'
        }
    });

    mongoose.model('Event', Event);
};