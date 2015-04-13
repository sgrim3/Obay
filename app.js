// Dependencies.
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');

//Import routes
var index = require('./routes/index');
var listing = require ("./routes/listing");
var feed = require ("./routes/feed");
var email = require('./routes/email');
var image = require('./routes/image');
var payment = require('./routes/payment');
var auth = require('./routes/auth');

// Line below disabled authentication for testing purposes.
var olinAuthMiddleware = auth.olinAuthMiddleware;
var venmoAuthMiddleware = auth.venmoAuthMiddleware;
// var olinAuthMiddleware = function (req, res, next) { next(); };

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

//API Authentication Routes
app.get('/venmoAuth', auth.venmoAuth);
app.get('/venmoAuth/addAccount', [olinAuthMiddleware, auth.venmoLinkAccount]);
app.get('/venmoAuth/redirect', [olinAuthMiddleware, payment.venmoRedirect]);
app.post('/olinAppsAuth', auth.olinAppsAuth);

// Our Routes.
// GET.
app.get('/isVenmoAuthenticated', auth.isVenmoAuthenticated);
app.get('/isOlinAuthenticated', auth.isOlinAuthenticated);

app.get('/sessionData', [olinAuthMiddleware, index.sessionData]);
app.get('/feed/free', [olinAuthMiddleware, feed.getFeed]);
app.get('/feed', [olinAuthMiddleware, feed.getFeed]);
app.get('/listing/:id', [olinAuthMiddleware, listing.getListing]);
app.put('/listing/:id', [olinAuthMiddleware, listing.updateListing]);


// TODO: Integrate email feature with actual app.
// Temporary route to send email.
app.get('/temporary_email_route', email.testEmail);

// POST.
app.post('/venmoRemoveAccount', [olinAuthMiddleware, auth.venmoRemoveAccount]);
app.post('/venmoPay', [venmoAuthMiddleware, payment.venmoPay]);
app.post('/setVenmoPayRedirect', [olinAuthMiddleware, payment.setVenmoPayRedirect]);
app.post('/logout', index.logout);
app.post('/listing', [olinAuthMiddleware, listing.postListing]);
app.post('/image', [olinAuthMiddleware, image.uploadMiddleware, image.uploadImage]);

app.listen(PORT, function(){
    console.log("Application running on port:", PORT);
});
