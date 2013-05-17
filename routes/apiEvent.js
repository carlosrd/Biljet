
/*jslint node: true */

"use strict";

var mongoose = require('mongoose');
var fs = require('fs');
var jQuery = require('jquery');
// var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var allSchemas = require('../models/allSchemas'),
    // qrCode = require('qrcode-npm/qrcode'),
    fs = require('fs');

var Event = mongoose.model('Event');
var User = mongoose.model('User');

exports.save = function (req, res) {
    var userId, userPassword;

    if (req.session.user) {
        userId = req.session.user._id;
        userPassword = req.session.user.password;
    } else {
        userId = req.body.id;
        userPassword = req.body.password;
    }

    User.findOne({_id: userId}, function (err, creator) {
        if (err) {
            res.send(err, 400);
        } else if (creator.password !== userPassword) {
            res.send("Bad password", 401);
        } else {
            var place, latitude, longitude, newEvent;

            place = req.body.place ? req.body.place : null;
            latitude = req.body.latitude ? req.body.latitude : null;
            longitude = req.body.longitude ? req.body.longitude : null;

            newEvent = new Event({
                title: req.body.title,
                finishAt: req.body.finishAt,
                createdAt: new Date().getTime(),
                price: req.body.price,
                creator: creator,
                province: req.body.province,
                city: req.body.city,
                place: place,
                postalCode: req.body.postalCode,
                address: req.body.address,
                latitude: latitude,
                longitude: longitude,
                category: req.body.category,
                imageName: req.body.imageName,
                capacity: req.body.capacity,
                description: req.body.description
            });

            newEvent.save(function (err) {
                if (err) {
                    console.log(err, "err: ");

                    res.send(err, 400);
                } else {
                    User.update(
                        {
                            _id: creator._id
                        },
                        {
                            $push:
                                {
                                    eventsOrganized: newEvent,
                                    eventsToGo: newEvent
                                }
                        },
                        function (err, data) {
                            if (err) {
                                console.log(err, "err: ");
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
        } else {
            res.send(events, 200);
        }
    });
};

exports.findByTitle = function (req, res) {
    Event.findOne({title: req.params.title}, function (err, event) {
        if (err) {
            res.send(err, 400);
        } else if (event === null) {
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
        } else if (event === null) {
            res.send("[]", 200);
        } else {
            res.send(event, 200);
        }
    });
};

exports.createdById = function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.send(err, 200);
        } else if (user === '[]') {
            res.send('The user doesn\'t exist', 400);
        } else {

            var before, after;

            before = req.query.before ? req.query.before : 1999999999; // a very long timestamp
            after = req.query.after ? req.query.after : 0;

            Event.find({creator: user})
                .where('finishAt').lte(before).gte(after)
                .limit(50)
                .sort('finishAt')
                .exec(function (err, events) {
                    if (err) {
                        res.send(err, 400);
                    } else if (events === null) {
                        res.send("[]", 200);
                    } else {
                        res.send(events, 200);
                    }
                });
        }
    });
};

exports.goingById = function (req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
        if (err) {
            res.send(err, 200);
        } else if (user === '[]') {
            res.send('The user doesn\'t exist', 400);
        } else {

            var before, after;

            before = req.query.before ? req.query.before : 1999999999; // a very long timestamp
            after = req.query.after ? req.query.after : 0;
            console.log(user, "user");
            
            Event.find({attendee: user})
                .where('finishAt').lte(before).gte(after)
                .limit(50)
                .sort('finishAt')
                .exec(function (err, events) {
                    if (err) {
                        res.send(err, 400);
                    } else if (events === null) {
                        res.send("[]", 200);
                    } else {
                        res.send(events, 200);
                    }
                });
        }
    });
};

exports.filterByProvince = function (req, res) {
    Event.find({province: req.params.number}, function (err, events) {
        if (err) {
            res.send(err, 400);
        } else if (events === null) {
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
};

exports.search = function (req, res) {
    Event.find({title: { $regex: req.params.title, $options: 'i'}}, function (err, events) {
        if (err) {
            res.send(err, 400);
        } else {
            res.send(events, 200);
        }
    });
};

exports.isGoing = function (req, res) {
    User.findOne({_id: req.body.id, password: req.body.password}, function (err, user) {
        if (err) {
            res.send(err, 400);
        } else {
            console.log(user, "user: ");
            if (user !== null) {
                if (user.eventsToGo.indexOf(req.params.id) > -1) {
                    res.send("true", 200);
                } else {
                    res.send("false", 200);
                }
            } else {
                res.send("false", 400);
            }
        }
    });
};

exports.goToEvent = function (req, res) {
    var c = Event.findOne({_id: req.params.id}, function (err, eventToGo) {
        if (err) {
            res.send(err, 400);
        } else {
            User.findOne({_id: req.body.id}, function (err, user) {
                if (err) {
                    res.send(err, 400);
                } else {
                    User.update(
                        {
                            _id: user._id,
                            password: req.body.password
                        },
                        {
                            $push:
                                {
                                    eventsToGo: eventToGo
                                }
                        },
                        function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                console.log("Event added successfully to " + user.username);
                                res.send(data, 200);

                                // var text = 'Nombre del evento: '+eventToGo.title+' usurio: '+user.username;

                                // var qr = qrCode.qrcode(4, 'M');
                                // qr.addData(text);
                                // qr.make();
                                // var imgTag = qr.createImgTag(4);
                                // //cosa= imgTag.replace('<img\u0020src="data:image/gif;base64,',"");
                                // var n=imgTag.indexOf("\u0020width=");
                                // var cosa2=imgTag.slice(32,n-1);
                                // fs.writeFile("./public/img/"+req.params.id+req.body.id, cosa2 , 'base64',function(err) {
                                //     if(err){
                                //         console.log(err);
                                //     }else{
                                //          console.log('qr create');
                                //     }
                                // });
                            }
                        }
                    );
                }
            });
        }
    });
};

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
                        {
                            _id: user._id,
                            password: req.body.password
                        },
                        {
                            $pull:
                                {
                                    eventsToGo: eventToGo
                                }
                        },
                        function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                res.send(data, 200);

                                // fs.unlink("./public/img/"+req.params.id+req.body.id, function (err) {
                                //     if (err){
                                //         console(err);
                                //     }
                                //     else{
                                //        console.log('Remove qr');
                                //     }
                                // });
                            }
                        }
                    );
                }
            });
        }
    });
};

exports.uploadImage = function (req, res) {
    // TODO: move and rename the file using req.files.path & .name)
    if (jQuery.isEmptyObject(req.files)) {
        res.send('Por favor, selecciona una imagen.', 400);
    } else {
        if (req.files.eventImage.size > 204800) {
            res.send('La imagen no puede superar los 200kb.', 400);
        } else {
            fs.rename(req.files.eventImage.path, 'public/img/' + req.files.eventImage.name, function (err) {
                if (err) {
                    res.send('Ha habido un error al subir la imagen.', 400);
                } else {
                    res.send(req.files.eventImage.name, 200);
                }
            });
        }
    }
};

