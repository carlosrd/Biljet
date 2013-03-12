// MongoDB conection
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var EventSchema = new Schema({
    title: { type: String, unique: true, required: true },
    finishAt: { type: Number, required: true },
    createdAt: Number,
    price: {type: Number, required: true },
    creator: { 
        type: Schema.Types.ObjectId,
        ref: 'User'
        // FIX ME - It's disabled because there are conflicts
        // with the user mongoose model
        // required: true
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
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    category: { type: String, required: true},
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'EventComment',
        default: null
    }]
});

var Event = mongoose.model('Event', EventSchema);

require('../public/js/models/User.js');

var User = mongoose.model('User');

exports.save = function (req, res) {

    // User.find({username: req.body.creator}, function (err, creator) {   

        var latitude = req.body.latitude ? req.body.latitude : null;
        var longitude = req.body.longitude ? req.body.longitude : null;

        var newEvent = new Event({
            title: req.body.title,
            finishAt: req.body.finishAt,
            createdAt: new Date().getTime(),
            price: req.body.price,
            creator: null,
            province: req.body.province,
            latitude: latitude,
            longitude: longitude,
            category: req.body.category
        });

        newEvent.save ( function (err) {
            if (err) {
                res.send(err, 500);
            } else {
                res.send(newEvent, 200);
            }
        });
    // });
};

exports.list = function (req, res) {
    Event.find({}, function (err, events) {
        if (err) {
            res.send(err, 500);
        } else if (events === null){
            res.send("[]", 200);
        } else {
            res.send(events, 200);
        }
    });
};

exports.findByTitle = function (req, res) {
    Event.findOne({title: req.params.title}, function (err, event) {
        if (err) {
            res.send(err, 500);
        } else if (event === null){
            res.send("[]", 200);
        } else {
            res.send(event, 200);
        }
    });
};
