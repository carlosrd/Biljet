
/*jslint node: true */

"use strict";

var mongoose = require('mongoose');
var fs = require('fs');
var util = require('util');
var jQuery = require('jquery');
var crypto = require('crypto');
// var Schema = mongoose.Schema;
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var allSchemas = require('../models/allSchemas'),
    fs = require('fs'),
    qrCode = require('qrcode-npm/qrcode');

var Event = mongoose.model('Event');
var User = mongoose.model('User');
var QR = mongoose.model('QR');

var superKey = "*****Incredible | secure _ phrase & in $ order / to ? protect ·  our * QRs****";


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
                attendee: creator,
                city: req.body.city,
                province: req.body.province,
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
                    res.send(err, 400);
                } else {
                    var newQr = new QR({
                        user: creator,
                        name: newEvent._id,
                        numberTickets: 1,
                        isUsed: false,
                        path: newEvent._id + '.png',
                        event: newEvent
                    });
                    newQr.save(function (err) {
                        if (err) {
                            res.send(err, 400);
                        } else {
                            createQR(newQr._id, creator._id, newEvent._id, 1);

                            User.update(
                                {
                                    _id: creator._id
                                },
                                {
                                    $push:
                                        {
                                            eventsOrganized: newEvent,
                                            eventsToGo: newEvent,
                                            qrs: newQr
                                        }
                                },
                                function (err, data) {
                                    if (err) {
                                        res.send(err, 400);
                                    } else {
                                        res.send(newEvent, 200);
                                    }
                                }
                            );
                        }
                    });
                }
            });
        }
    });
};

exports.list = function (req, res) {

    var limit;

    limit = req.query.limit ? req.query.limit : 100;
    Event.find({})
        .limit(limit)
        .populate('attendee')
        .populate('creator')
        .sort('finishAt')
        .exec(function (err, events) {
            if (err) {
                res.send(err, 400);
            } else {
                res.send(events, 200);
            }
        });
};

exports.findByTitle = function (req, res) {
    Event.findOne({title: req.params.title})
        .populate('attendee')
        .populate('creator')
        .exec(function (err, event) {
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
    Event.findOne({_id: req.params.id})
        .populate('attendee')
        .populate('creator')
        .exec(function (err, event) {
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
    Event.find({province: req.params.number})
        .populate('attendee')
        .populate('creator')
        .exec(function (err, events) {
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
    Event.find({title: { $regex: req.params.title, $options: 'i'}})
        .populate('attendee')
        .populate('creator')
        .exec(function (err, events) {
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
    Event.findOne({_id: req.params.id}, function (err, eventToGo) {
        if (err) {
            res.send(err, 400);
        } else {
            User.findOne({_id: req.body.id}, function (err, user) {
                if (err) {
                    res.send(err, 400);
                } else {
                    Event.update(
                        {
                            _id: req.params.id
                        },
                        {
                            $push:
                                {
                                    attendee: user
                                }
                        },
                        function (err, data) {
                            if (err) {
                                res.send(err, 400);
                            } else {
                                var newQr = new QR({
                                    user: user,
                                    name: eventToGo._id,
                                    numberTickets: 1,
                                    isUsed: false,
                                    path: eventToGo._id + '.png',
                                    event: eventToGo
                                });
                                newQr.save(function (err) {
                                    if (err) {
                                        res.send(err, 400);
                                    } else {
                                        createQR(newQr._id, user._id, eventToGo._id, 1);
                                        User.update(
                                            {
                                                _id: user._id,
                                                password: req.body.password
                                            },
                                            {
                                                $push:
                                                    {
                                                        qrs: newQr,
                                                        eventsToGo: eventToGo
                                                    }
                                            },
                                            function (err, data) {
                                                if (err) {
                                                    res.send(err, 400);
                                                } else {
                                                    // DEBUG
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
                    Event.update(
                        {
                            _id: req.params.id
                        },
                        {
                            $pull:
                                {
                                    attendee: user
                                }
                        },
                        function (err, data) {
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
                        }
                    );
                }
            });
        }
    });
};

exports.uploadImage = function (req, res) {
    if (jQuery.isEmptyObject(req.files)) {
        res.send('Por favor, selecciona una imagen.', 400);
    } else {
        console.log(req.files, '**** req files: ****');
        if (req.files.eventImage.size > 307200) {
            res.send('La imagen no puede superar los 200kb.', 400);
        } else {
            var readStream, writeStream;
            readStream = fs.createReadStream(req.files.eventImage.path);
            writeStream = fs.createWriteStream('public/img/' + req.files.eventImage.name);
            readStream.pipe(writeStream);
            readStream.on('error', function (err) {
                console.log(err);
                res.send(err, 400);
            });
            readStream.on('end', function(data) {
                console.log(req.files.eventImage.name, "*** end callback, name: ");
                res.send(req.files.eventImage.name, 200);
            });
        }
    }
};

exports.create = function (req, res) {
    // createQR(11, 22, 33, 44);
    if (validQR('yCnXw7EaAd3SJ+2gIzKJRIo=')) {
        res.send('', 200);
    } else {
        res.send('Invalid QR', 400);
    }
};

function createQR (qrId, userId, eventId, numberTickets) {
    var text, textEncrypted, qr, imgTag, n, imgFinal, readStream, writeStream;

    text = qrId + " " + userId + " " + eventId + " " + 1;
    textEncrypted = encrypt(superKey, text);
    qr = qrCode.qrcode(4, 'M');

    qr.addData(textEncrypted);
    qr.make();
    imgTag = qr.createImgTag(4);
    n = imgTag.indexOf('\u0020width=');
    imgFinal = imgTag.slice(32, n - 1);

    var buff = new Buffer(imgFinal, 'base64');

    var path = 'public/img/qr_' + qrId + '.png';
    var stream = fs.createWriteStream(path);
    console.log(path, 'route to QR: ');
    stream.write(buff);
    stream.on('error', function (err) {
        console.log(err); 
    });
    stream.on("end", function() {
        console.log('FINSIH!!');
        stream.end();
    });
}

    // DEBUG

    // readStream = fs.createReadStream(imgFinal);
    // writeStream = fs.createWriteStream('public/qr/' + idQR + '.png');
    // readStream.pipe(writeStream);
    // readStream.on('error', function (err) {
    //     console.log(err);
    //     return err;
    // });
    // readStream.on('end', function () {
    //     console.log(imgFinal);
    //     return imgFinal;
    // });

    // fs.writeFile('/public/qr/' + idQR + '.png', imgFinal, 'base64', function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('qr create');
    //     }
    // });
// }

function validQR(stringQR) {

    var decryptString, elementsQR, idQR, userId, eventId, numberTickets;

    decryptString = decrypt(superKey, stringQR);
    elementsQR = decryptString.split(" ");
    console.log(elementsQR, "elementsQR: ");
    idQR = elementsQR[0];
    userId = elementsQR[1];
    eventId = elementsQR[2];
    numberTickets = elementsQR[3];

    QR.findOne({_id: idQR}, function (err, QRToCompare) {
        if (err) {
            return false;
        } else if (QRToCompare === null) {
            return false;
        } else {
            if (QRToCompare._id !== userId || QRToCompare.event._id !== eventId ||
                    QRToCompare.numberTickets !== numberTickets || QRToCompare.isUsed) {
                return false;
            } else {
                return true;
            }
        }
    });
}

function encrypt (key, plaintext) {

    var cipher = crypto.createCipher('aes-256-cbc', key), encryptedPassword;

    cipher.update(plaintext, 'utf8', 'base64');
    encryptedPassword = cipher.final('base64');
    console.log('encrypted :', encryptedPassword);

    return encryptedPassword;
}

function decrypt(key, encryptedPassword) {

    var decipher = crypto.createDecipher('aes-256-cbc', key), decryptedPassword;

    decipher.update(encryptedPassword, 'base64', 'utf8'); 
    decryptedPassword = decipher.final('utf8');
    console.log('decrypted :', decryptedPassword);

    return decryptedPassword;
}

