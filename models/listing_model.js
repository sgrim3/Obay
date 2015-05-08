/*
Mongoose model for a listing
Keeps track of all the listings
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = mongoose.Schema({
    listing_name: String,
    listing_description: String, 
    listing_image: String,
    listing_creator: String,
    listing_buyer: String,
    listing_timeCreated: Number,
    listing_open: Boolean,
    listing_price: Number,
    //venmoEnabled tells us whether you can pay for a listing w/ venmo or not
    venmoEnabled: Boolean,
    //venmoPaid keeps track of whether a listing was paid for with venmo
    venmoPaid: Boolean,
});

module.exports.listing = mongoose.model('listing',listingSchema);
