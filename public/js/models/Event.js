var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var Events = new Schema({
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
            ref: 'Comment_Event'
        },
        qr: String
    });

    mongoose.model('Event', Event);
}