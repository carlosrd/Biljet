
/*jslint node: true */

/**
 * Module dependencies.
 */

"use strict";

var express = require('express'),
    home = require('./routes/home'),
    user = require('./routes/user'),
    eventDetails = require('./routes/eventDetails'),
    discover = require('./routes/discover'),
    createEvent = require('./routes/createEvent'),
    calendar = require('./routes/calendar'),
    apiUser = require('./routes/apiUser'),
    apiEvent = require('./routes/apiEvent'),
    http = require('http'),
    path = require('path');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.compress());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser('your secret here'));
    app.use(express.session({ secret: "SupersecretpasswordphraseforISproject"}));
    app.use(app.router);
});

app.configure('dev', function () {
    app.use(express.errorHandler());
});

function checkAuth(req, res, next) {
    if (!req.session.user) {
        res.redirect('back');
    } else {
        next();
    }
}

app.get('/', home.index);
app.get('/discover', checkAuth, discover.index);
app.get('/create', checkAuth, createEvent.index);
app.get('/calendar', calendar.index);
app.get('/event/:id', checkAuth, eventDetails.index);

app.post('/api/user', apiUser.save);
app.get('/api/user', apiUser.list);
app.del('/api/user/:id', apiUser.delete);
app.get('/api/user/:id', apiUser.findById);
app.get('/api/user/u/:username', apiUser.findByUsername);
app.get('/api/user/:id/e/going', apiUser.eventsGoing);
app.get('/api/user/:id/e/created', apiUser.eventsCreated);

app.get('/api/event', apiEvent.list);
app.get('/api/event/:id', apiEvent.findById);
app.post('/api/event', apiEvent.save);
app.del('/api/event/:id', apiEvent.delete);
app.get('/api/event/created/:id', apiEvent.createdById);
app.get('/api/event/going/:id', apiEvent.goingById);
app.get('/api/event/search/:title', apiEvent.search);
app.post('/api/event/is-going/:id', apiEvent.isGoing);
app.post('/api/event/go/:id', apiEvent.goToEvent);
app.post('/api/event/dont-go/:id', apiEvent.dontGoToEvent);
app.get('/api/event/province/:number', apiEvent.filterByProvince);
app.get('/api/event/title/:title', apiEvent.findByTitle);

app.get('/api/qr', apiEvent.getQr);
app.get('/api/check-qr', apiEvent.checkQr);

app.post('/upload', apiEvent.uploadImage);

app.get('/login', user.login);
app.post('/login', apiUser.login);
app.get('/logout', apiUser.logout);

app.get('/signup', apiUser.signup);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
