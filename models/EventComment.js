var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var EventComment = new Schema({
        username: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: Number,
        text: String
    });

    mongoose.model('EventComment', EventComment);
};