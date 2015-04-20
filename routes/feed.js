// Require my util scripts.
var validate_listing = require('./validateInput.js').validate_listing;

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

// Get feed (which only includes open listings) sorted by time.
exports.getFeed = function(req, res) {
  Listing.find().sort({"item_timeCreated": -1}).exec(function (err, listings) {
      if (err) {
          console.error("SG|/routes/feed.js|getFeed|error");
          console.log(err);
          res.status(500).send("Could not search Listings!");
      }
      else {
          // Only return open listings.
          listings = listings.filter(function(listing){
              return listing.listing_open;
          });
          res.send(listings);	
      }
  });
};

exports.getFreeFeed = function(req,res){
  Listing.find({listing_price: 0}).sort({"item_timeCreated": -1})
    .exec(function (err, listings) {
      if (err) {
          console.log ("SG|/routes/feed.js|getFreeFeed|error");
          console.log(err);
          res.status(500).send("Could not search Listings!");
      }
      else {
          // Only return open listings.
          listings = listings.filter(function(listing){
              return listing.listing_open;
          });
          res.send(listings); 
      }
  });
}

exports.getUserFeed = function(req, res){
  var userId = req.params.id;
  // .populate turns references into the actual mongo objects.
  User.findOne({userId:userId}).populate('listings').exec(function(err, user){
    if (err) {
      console.log("SG|/routes/feed.js|getUserFeed| error");
      console.log(err);
      res.status(500).send("Could not search Users!");
    } else {
      res.send(user.listings);
    }
  });
}

module.exports = exports;