//require my util scripts
var ensureOlinAuthenticatedServer = require('./auth.js').ensureOlinAuthenticatedServer
var ensureVenmoAuthenticatedServer = require('./auth.js').ensureVenmoAuthenticatedServer
var validate_listings = require('./validateInput.js').validate_listings

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//listings is the exported module object
var listings = {};

//gets list of all listings and sorts by timestamp
listings.list = function(req, res) {
    var onSuccess = function(){
        Listing.find().sort({"item_timeCreated": -1}).exec(function (err, listings) {
            if (err) {
                console.log ("Could not search Listings!");
                res.status(500).send("Could not search Listings!");
            }
            else {
                res.send(listings);	
            }
        });
    };
    var onError = function(){
        res.status(401).send('Log in to OlinApps to access this functionality!');
    };
    ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
};

listings.add = function (req, res) {
    var onSuccess = function(){
        var onValidListing = function(){
            var newListing = new Listing({
                item_name: req.body.item_name,
                item_description: req.body.item_description,
                item_image: req.body.item_image,
                item_creator: req.session.user.userId,
                item_timeCreated: Date.now(),
                item_open: true,
                item_price: req.body.item_price
            });
            // Save new listing to database
            newListing.save(function(err){
                if(err){
                    console.error('Could not save listing!');
                    res.status(500).send("Could not save listing!");
                }
                console.log(newListing)
                res.send(newListing);
            }); 
        };
        validate_listings(req, res, onValidListing);
    };
    var onError = function(){
        res.status(401).send('Log in to OlinApps to access this functionality!');
    };
    ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
};

module.exports = listings;
