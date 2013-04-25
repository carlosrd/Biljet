var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var allSchemas = require('../models/allSchemas');


var Event = mongoose.model('Event');
var User = mongoose.model('User');

exports.save = function (req, res) {

    var userId = req.body.id ? req.body.id : req.session.user._id;
    var userPassword = req.body.password ? req.body.password : req.session.user.password;
    User.findOne({_id: req.session.user._id}, function (err, creator) {
        if (err) {
            res.send(err, 400);
        } else if (creator.password !== userPassword) {
            res.send("Bad password", 401);
        } else {
            var latitude = req.body.latitude ? req.body.latitude : null;
            var longitude = req.body.longitude ? req.body.longitude : null;

            var newEvent = new Event({
                title: req.body.title,
                finishAt: req.body.finishAt,
                createdAt: new Date().getTime(),
                price: req.body.price,
                creator: creator,
                province: req.body.province,
                latitude: latitude,
                longitude: longitude,
                category: req.body.category,
                imageName: req.body.imageName
            });

            newEvent.save ( function (err) {
                if (err) {
                    res.send(err, 400);
                } else {
                    User.update(
                        { _id: creator._id },
                        { $push:
                            { eventsOrganized: newEvent, eventsToGo: newEvent }
                        }, function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                res.send(newEvent, 200);
                                console.log("Event added successfully to " + creator.username);
                            }
                        }
                    );
                }
            });
        }
    });
};

exports.list = function (req, res) {    
    Event.find({}, function (err, events) {
        if (err) {
            res.send(err, 400);
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
            res.send(err, 400);
        } else if (event === null){
            res.send("[]", 200);
        } else {
            res.send(event, 200);
        }
    });
};

exports.findById = function (req, res) {
    Event.findOne({_id: req.params.id}, function (err, event) {
        if (err) {
            res.send(err, 400);
        } else if (event === null){
            res.send("[]", 200);
        } else {
            res.send(event, 200);
        }
    });
};

exports.filterByProvince = function (req, res) {
    Event.find({province: req.params.number}, function (err, events) {
        if (err) {
            res.send(err, 400);
        } else if (events === null){
            res.send("[]", 200);
        } else {
            res.send(events, 200);
        }
    });
};

exports.delete = function (req, res) {
    Event.remove({_id: req.params.id}, function (err) {
        if (err) {
            res.send(err, 400);
        } else {
            res.send("", 200);
        }
    });
}

exports.isGoing = function (req, res) {
    User.findOne({_id: req.body._id, password: req.body.password}, function (err, user) {
        if (err) {
            res.send(err, 400);
        } else {
            console.log(user, "user: ");
            if (user != null) {
                if (user.eventsToGo.indexOf(req.params.id) > -1) {
                    res.send("true", 200);
                } else {
                    res.send("false", 400);
                }
            } else {
                res.send("false", 400);
            }
        }
    });
}

exports.goToEvent = function (req, res) {
    Event.findOne({_id: req.params.id}, function (err, eventToGo) {
        if (err) {
            res.send(err, 400);
        } else {
            User.findOne({_id: req.body.id}, function (err, user) {
                if (err) {
                    res.send(err, 400);
                } else {
                    User.update(
                        { _id: user._id, password: req.body.password },
                        { $push:
                            { eventsToGo: eventToGo }
                        }, function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                console.log("Event added successfully to " + user.username);
                                res.send(data, 200);
                            }
                        }
                    );
                }
            });
        }
    });
}

exports.dontGoToEvent = function (req, res) {
    Event.findOne({_id: req.params.id}, function (err, eventToGo) {
        if (err) {
            res.send(err, 400);
        } else {
            User.findOne({_id: req.body.id}, function (err, user) {
                if (err) {
                    res.send(err, 400);
                } else {
                    User.update(
                        { _id: user._id, password: req.body.password },
                        { $pull:
                            { eventsToGo: eventToGo }
                        }, function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                res.send(data, 200);
                            }
                        }
                    );
                }
            });
        }
    });
}

