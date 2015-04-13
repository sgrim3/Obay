var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = mongoose.Schema({
	listing_name: String,
  listing_description: String, 
  listing_image: String,
  listing_creator: String,
  listing_timeCreated: Number,
  listing_open: Boolean,
  listing_price: Number

});

module.exports.listing = mongoose.model('listing',listingSchema);
module.exports.listingSchema = listingSchema;
