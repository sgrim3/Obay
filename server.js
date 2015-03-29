// NPM Modules

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Custom Modules

var index = require('./routes/index');

// Mongoose, Express

var app = express();
var mongoURI = process.env.MONGOURI || "mongodb://localhost/test";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3000;

var page_schema = new mongoose.Schema({
	title: String,
	content: String
});

var Page = mongoose.model("Page", page_schema);

app.set('views', __dirname + '/');

// Middleware

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes

app.get('/', index.home);

// Insert a new page
app.post( '/page/:id', function (req, res) {
    var page = new Page({
        title: req.body.title,
        content: req.body.content,
    });
    
    return page.save(function (err) {
        if(!err) {
            console.log('Page Created');
            return res.send(page);
        } 
        else
            console.log(err);
    });
});

app.get('/pages', function (req, res) {
	Page.find({}, function (err, pages) {
		if (err)
			res.sendStatus(500);
		res.send(pages);
	});
});

app.get('/page/:id', function (req, res) {
    Page.findById(req.params.id, function (err, page) {
        if (err)
            res.sendStatus(500);
        res.send(page);
    })
});

app.delete('/page/:id/:id', function (req, res) {
    return Page.findById(req.params.id, function (err, page) {
        return page.remove (function (err) {
            if (!err) {
                return res.send('');
            }
            else {
                console.log(err);
            }
        });
    });
});

app.put('/page/:id/:id', function (req, res) {
    return Page.findById( req.params.id, function( err, page ) {
        page.title = req.body.title;
        page.content = req.body.content;

        return page.save( function (err) {
            return res.send (page);
        });
    });
});

app.listen(PORT, function() {
	console.log('Application running on port: ', PORT);
});