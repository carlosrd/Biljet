var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var UserComment = new Schema({
        username: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        createdAt: Number,
        text: String
    });

    mongoose.model('UserComment', UserComment);
};