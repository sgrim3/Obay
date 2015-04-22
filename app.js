/*
Router and dependencies
*/

// Dependencies.
var express = require('express.io');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var publicAddress = require('./getIP');

//Import routes.
var index = require('./routes/index');
var listing = require ("./routes/listing");
var feed = require ("./routes/feed");
var email = require('./routes/email');
var image = require('./routes/image');
var payment = require('./routes/payment');
var auth = require('./routes/auth');

var olinAuthMiddleware = auth.olinAuthMiddleware;
// Line below disabled authentication for testing purposes.
var venmoAuthMiddleware = auth.venmoAuthMiddleware;
// var olinAuthMiddleware = function (req, res, next) { next(); };

var app = express();

// Connect socket.io
app.http().io();
// Intentionally make a global variable here! That way the routes can access io.
io = app.io;

//Set up mongolab and PORTS to work locally and on Heroku.
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);
var PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'secret', resave: false, saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));

// GET public port of local server.
app.get('/publicPort', function publicPort(req, res) {
  res.status(200).send(publicAddress);
});

//API Authentication Routes
app.get('/venmoAuth', auth.venmoAuth);
app.get('/venmoAuth/addAccount', [olinAuthMiddleware, auth.venmoLinkAccount]);
app.get('/venmoAuth/redirect', [olinAuthMiddleware, payment.venmoRedirect]);
app.post('/olinAppsAuth', auth.olinAppsAuth);

// Our Routes.
// GET.
app.get('/isVenmoAuthenticated', auth.isVenmoAuthenticated);
app.get('/isOlinAuthenticated', auth.isOlinAuthenticated);

app.get('/userData', [olinAuthMiddleware, index.userData]);
//app.get('/feed/free', [olinAuthMiddleware, feed.getFreeFeed]);
app.get('/feed', [olinAuthMiddleware, feed.getFeed]);
//app.get('/feed/user/:id', [olinAuthMiddleware, feed.getUserFeed]);
app.get('/listing/:id', [olinAuthMiddleware, listing.getListing]);
app.put('/listing/:id', [olinAuthMiddleware, listing.updateListing]);
app.delete('/listing/:id', [olinAuthMiddleware, listing.deleteListing]);

// TODO: Integrate email feature with actual app.
// Temporary route to send email.
app.get('/temporary_email_route', email.testEmail);

// POST.
app.post('/venmoRemoveAccount', [
  olinAuthMiddleware, 
  auth.venmoRemoveAccount
]);
app.post('/venmoPay', [venmoAuthMiddleware, payment.venmoPay]);
app.post('/setVenmoPayRedirect', [
  olinAuthMiddleware, 
  payment.setVenmoPayRedirect
]);
app.post('/logout', index.logout);
app.post('/listing', [olinAuthMiddleware, listing.postListing]);
app.post('/image', [
  olinAuthMiddleware, 
  image.uploadMiddleware, 
  image.uploadImage
]);

app.listen(PORT, "0.0.0.0");
