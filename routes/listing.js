//require my util scripts
var validate_listing = require('./validateInput.js').validate_listing

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//exports is the exported module object
var exports = {};

exports.postListing = function (req, res) {
    var onValidListing = function(){
        var newListing = new Listing({
            listing_name: req.body.listing_name,
            listing_description: req.body.listing_description,
            listing_image: req.body.listing_image,
            listing_creator: req.session.user.userId,
            listing_time_created: Date.now(),
            listing_open: true,
            listing_price: parseFloat(req.body.listing_price.replace(/,/g, ''))
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
    validate_listing(req, res, onValidListing);
};


exports.getListing = function(req, res) {
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
}


module.exports = exports;

