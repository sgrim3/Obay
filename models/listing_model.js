var mongoose = require('mongoose');

var listingSchema = mongoose.Schema({
    item_description: String
});

module.exports.listing = mongoose.model('listing',listingSchema);
module.exports.listingSchema = listingSchema;
