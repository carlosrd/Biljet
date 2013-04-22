
/**
 * Module dependencies.
 */

var express = require('express'),
    // index = require('./routes'),
    home = require('./routes/home'),
    user = require('./routes/user'),
    social = require('./routes/social'),
    discover = require('./routes/discover'),
    createEvent = require('./routes/createEvent'),
    qrtest = require('./routes/qrtest'),
    calendar = require('./routes/calendar'),
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
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
});

app.configure('development', function(){
    app.use(express.errorHandler());
});



app.get('/', home.index);
app.get('/social', social.index);
app.get('/discover', discover.index);
app.get('/create', createEvent.index);
app.get('/qrtest', qrtest.index);
app.get('/calendar', calendar.index);

app.post('/api/user', apiUser.save);
app.get('/api/user', apiUser.list);
app.get('/api/user/:username', apiUser.findByUsername);

app.post('/api/event', apiEvent.save);
app.get('/api/event', apiEvent.list);
app.get('/api/event/province/:number', apiEvent.filterByProvince);
app.get('/api/event/title/:title', apiEvent.findByTitle);
app.get('/api/event/id/:id', apiEvent.findById);

app.get('/login', user.login);
app.post('/login', apiUser.login);

app.get('/signup', apiUser.signup);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
