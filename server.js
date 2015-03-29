var express = require("express");
var session = require('express-session');
var path = require("path");
var http = require('http');
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs  = require("express-handlebars");
var mongoose = require("mongoose");
var methodOverride = require("method-override");

var wine = require('./routes/wines');

var app = express();


mongoose.connect(process.env.MONGOURI || 'mongodb://localhost/test');

//Middleware
// app.engine("handlebars", exphbs({defaultLayout: "main"}));
// app.set("view engine", "handlebars");


app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(logger("dev"));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(methodOverride());
    app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, "public")));
});

// app.get('/wines', wine.findAll);
// app.get('/wines/:id', wine.findById);
// app.post('/wines', wine.addWine);
// app.put('/wines/:id', wine.updateWine);
// app.delete('/wines/:id', wine.deleteWine);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
