var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listingSchema = mongoose.Schema({
	item_name: String,
    item_description: String, 
    item_image: String,
    item_creator: String,
    item_timeCreated: Number,
    item_open: Boolean,
    item_price: Number
});

module.exports.listing = mongoose.model('listing',listingSchema);
module.exports.listingSchema = listingSchema;
