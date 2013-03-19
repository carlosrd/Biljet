// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// module.exports = function () {
//     var eventSchema = new Schema({
//         title: { type: String, unique: true, required: true },
//         finishAt: { type: Number, required: true },
//         createdAt: Number,
//         price: {type: Number, required: true },
//         creator: { 
//             type: Schema.Types.ObjectId,
//             ref: 'User'
//             // FIX ME - It's disabled because there are conflicts
//             // with the user mongoose model
//             // required: true
//         },
//         attendee: [{
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//             default: null
//         }],
//         followers: [{
//             type: Schema.Types.ObjectId,
//             ref: 'User',
//             default: null
//         }],
//         province: { type: String, required: true },
//         latitude: { type: Number, default: null },
//         longitude: { type: Number, default: null },
//         category: { type: String, required: true},
//         comments: [{
//             type: Schema.Types.ObjectId,
//             ref: 'EventComment',
//             default: null
//         }]
//     });

//     var Event = mongoose.model('Event', eventSchema);
// }