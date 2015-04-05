//require my util scripts
var validate_listings = require('./validateInput.js').validate_listings

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//exports is the exported module object
var exports = {};

//gets list of all open listings and sorts by timestamp
exports.list = function(req, res) {
    Listing.find().sort({"item_timeCreated": -1}).exec(function (err, listings) {
        if (err) {
            console.log ("Could not search Listings!");
            res.status(500).send("Could not search Listings!");
        }
        else {
            //only return open listings
            listings = listings.filter(function(item){
                return item.item_open;
            });
            res.send(listings);	
        }
    });
};

exports.add = function (req, res) {
    var onValidListing = function(){
        var newListing = new Listing({
            item_name: req.body.item_name,
            item_description: req.body.item_description,
            item_image: req.body.item_image,
            item_creator: req.session.user.userId,
            item_timeCreated: Date.now(),
            item_open: true,
            item_price: parseFloat(req.body.item_price.replace(/,/g, ''))
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


exports.item = function(req, res) {
    var onSuccess = function(){
        var id=req.params.id;
        Listing.findOne({_id:id}).exec(function (err, item) {
            if (err) {
                console.log ("Could not search Listings!");
                res.status(500).send("Could not search Listings!");
            }
            else {
                res.send(item); 
                //console.log('found item' + id);
            }
        });
    };
    var onError = function(){
        res.status(401).send('Log in to OlinApps to access this functionality!');
    };
    ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
}


module.exports = exports;

