var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var EventComment = new Schema({
        username: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        destinatary: { 
            type: Schema.Types.ObjectId,
            ref: 'Event'
        },
        createdAt: Number,
        text: String
    });

    mongoose.model('EventComment', EventComment);
});