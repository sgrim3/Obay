//require my util scripts
var validate_listing = require('./validateInput.js').validate_listing

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//get feed (which only includes open listings) sorted by time
exports.getFeed = function(req, res) {
  Listing.find().sort({"item_timeCreated": -1}).exec(function (err, listings) {
      if (err) {
          console.error("Could not search Listings!");
          res.status(500).send("Could not search Listings!");
      }
      else {
          //only return open listings
          listings = listings.filter(function(listing){
              return listing.listing_open;
          });
          res.send(listings);	
      }
  });
};

exports.getFreeFeed = function(req,res){
  Listing.find({listing_price: 0}).sort({"item_timeCreated": -1}).exec(function (err, listings) {
      if (err) {
          console.log ("Could not search Listings!");
          res.status(500).send("Could not search Listings!");
      }
      else {
          console.log("listings: " +listings)
          //only return open listings
          listings = listings.filter(function(listing){
              return listing.listing_open;
          });
          res.send(listings); 
      }
  });
}

exports.getUserFeed = function(req, res){
  var userId = req.params.id;
  //.populate turns references into the actual mongo objects
  User.findOne({userId:userId}).populate('listings').exec(function(err, user){
    if (err) {
      res.status(500).send("Could not search Users!");
    } else {
      console.log('get userFeed');
      console.log(user);
      console.log(user.listings);
      res.send(user.listings);
    }
  });
}

module.exports = exports;

