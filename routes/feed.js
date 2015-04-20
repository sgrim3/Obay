// Require my util scripts.
var validate_listing = require('./validateInput.js').validate_listing;

var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//Get feed uses get request query params to filter the listings it finds and creates
exports.getFeed = function(req, res) {
  Listing.find(req.query).sort({"item_timeCreated": -1}).exec(function (err, listings) {
      if (err) {
          console.error("SG|/routes/feed.js|getFeed|error");
          console.log(err);
          res.status(500).send("Could not search Listings!");
      }
      else {
          res.send(listings);	
      }
  });
};

module.exports = exports;
