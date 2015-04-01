// Dependencies.
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index.js')
var session = require('express-session');

var app = express();

//Set up mongolab and PORTS to work locally and on heroku.
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);
var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'secret', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes.
// GET.
app.get('/isVenmoAuthenticated', index.isVenmoAuthenticated);
app.get('/isOlinAuthenticated', index.isOlinAuthenticated);
app.get('/venmoAuth', index.venmoAuth);
app.get('/sessionData', index.sessionData);

// POST.
app.post('/venmoPay', index.venmoPay);
app.post('/olinAppsAuth', index.olinAppsAuth);
app.post('/logout', index.logout);


app.listen(PORT, function(){
    console.log("Application running on port:", PORT);
});