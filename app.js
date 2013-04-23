
/**
 * Module dependencies.
 */

var express = require('express'),
    // index = require('./routes'),
    home = require('./routes/home'),
    user = require('./routes/user'),
    social = require('./routes/social'),
    eventInformation = require('./routes/eventInformation'),
    discover = require('./routes/discover'),
    createEvent = require('./routes/createEvent'),
    qrtest = require('./routes/qrtest'),
    apiUser = require('./routes/apiUser'),
    apiEvent = require('./routes/apiEvent'),
    http = require('http'),
    path = require('path');


// MongoDB conection
var mongoose = require('mongoose'),
Schema = mongoose.Schema;


// WARNING!!!
// This line connect to the remote Mongo Database, use carefully!!
// For testing purposes, use the localhost DB (the line commented below)
mongoose.connect('mongodb://admin:admin@dharma.mongohq.com:10010/Biljet');
// mongoose.connect('localhost', 'biljet');

var db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection error: "));

var app = express();

app.configure(function(){
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

app.configure('dev', function(){
    app.use(express.errorHandler());
});

function checkAuth(req, res, next) {
    console.log(req, "req: ");
    if (! req.session.user) {
        res.send('You are not authorized to view this page');
    } else {
        next();
  }
}

app.get('/', home.index);
app.get('/social', social.index);
app.get('/discover', discover.index);
app.get('/create', createEvent.index);
app.get('/qrtest', qrtest.index);
app.get('/eventInformation', eventInformation.index);


app.post('/api/user', apiUser.save);
app.get('/api/user', apiUser.list);
app.delete('/api/user/:id', apiUser.delete);
app.get('/api/user/:id', apiUser.findById);
app.get('/api/user/u/:username', apiUser.findByUsername);

app.get('/api/event', apiEvent.list);
app.get('/api/event/:id', apiEvent.findById);
app.post('/api/event', apiEvent.save);
app.post('/api/event/go/:id', apiEvent.goToEvent);
app.post('/api/event/dont-go/:id', apiEvent.dontGoToEvent);
app.delete('/api/event/:id', apiEvent.delete);
app.get('/api/event/province/:number', apiEvent.filterByProvince);
app.get('/api/event/title/:title', apiEvent.findByTitle);


app.get('/login', user.login);
app.post('/login', apiUser.login);
app.get('/logout', apiUser.logout);

app.get('/signup', apiUser.signup);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
