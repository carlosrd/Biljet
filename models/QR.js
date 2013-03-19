var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = function () {
    var QR = new Schema({
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

    mongoose.model('QR', QR);
});