
/*
 * GET eventos page.
 */

exports.index = function(req, res){
    var mongoose = require('mongoose');
    var db = mongoose.createConnection('localhost', 'biljet');
    db.on('error', console.error.bind(console.log("Connection error: ")));

    var eventSchema = new mongoose.Schema({
        title: String,
        description: String,
        price: Number
    });

    var Event = db.model('Event', eventSchema);
    var newEvent = new Event({
        title: 'nuevoEvento',
        description: 'super evento magnifiguay en xxx lugar',
        price: 20
    });

    newEvent.save(function (err) {
      console.log('meow');
    });

    res.render('descubrir', { title: 'Biljet :: Descubrir Eventos', subtitle: 'Descubrir Eventos section' });
};