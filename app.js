
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('routes'),
    index = require('routes'),
    user = require('routes/user'),
    social = require('routes/social'),
    discover = require('routes/discover'),
    createEvent = require('routes/createEvent'),
    passport = require('passport'),
    http = require('http'),
    path = require('path');

var APIUser = require('routes/APIUser'),
    APIEvent = require('routes/APIEvent');


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
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(require('less-middleware')({ src: __dirname + '/public' }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.cookieParser('your secret here'));
    app.use(express.session());
    app.use(passport.initialize());
    app.use(passport.session())
});

app.configure('development', function(){
    app.use(express.errorHandler());
});



app.get('/', routes.index);
app.get('/social', social.index);
app.get('/descubrir', discover.index);
app.get('/createEvent', createEvent.index);


app.post('/api/user', APIUser.save);
app.get('/api/user', APIUser.list);
app.get('/api/user/:username', APIUser.findByUsername);

app.post('/api/event', APIEvent.save);
app.get('/api/event', APIEvent.list);
app.get('/api/event/:title', APIEvent.findByTitle);

app.get('/login', user.login);
app.post('/login', APIUser.login);


http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
