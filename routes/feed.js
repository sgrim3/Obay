//require my util scripts
var validate_listing = require('./validateInput.js').validate_listing

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//get feed (which only includes open listings) sorted by time
exports.getFeed = function(req, res) {
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

module.exports = exports;

