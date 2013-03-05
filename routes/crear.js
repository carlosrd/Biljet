
/*
 * GET crear page.
 */

exports.index = function(req, res){

// MongoDB conection
var mongoose = require('mongoose'),
Schema = mongoose.Schema;
mongoose.connect('mongodb://admin:admin@dharma.mongohq.com:10010/Biljet');
var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

    var eventSchema = new Schema({
        name: String,
        date: Number,
        price: Number,
        creator: { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        people_follow: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        people_signup: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        followers: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        location: String,
        comments: {
            type: Schema.Types.ObjectId,
            ref: 'Comment_Event'
        },
        qr: String
    });

    var userSchema = new Schema({
        name: String,
        surname: String,
        events: { 
            type: Schema.Types.ObjectId,
            ref: 'Event'
        }
    });

    var Event = mongoose.model('Event', eventSchema);
    var User = mongoose.model('User', userSchema);
    
    var raul = new User({
       name: 'raul',
       surname: 'marcos' 
    });

    raul.save (function (err) {

        if (err) {
            return handleError(err);
        }

        var event1 = new Event({
            name: 'event1',
            date: 123456,
            price: 10,
            creator: raul._id,
            people_follow: null,
            people_signup: null,
            followers: null,
            location: 'Madrid',
            comments: null,
            QR: '/qr/event1'
        });

        event1.save (function (err){
            if (err) {
                return handleError(err);
            }           
        });
    });

    raul.events.push(event1);

    User
    .findOne({ name: 'raul' })
    .populate('events') // only works if we pushed refs to children
    .exec(function (err, person) {
        if (err) return handleError(err);
        console.log(person);
    })
    

    res.render('crear', { title: 'Biljet :: Crear Evento', subtitle: 'Crear Evento section' });
};