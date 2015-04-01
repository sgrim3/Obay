var mongoose = require('mongoose');

var listingSchema = require('./listing_model.js').listingSchema;

var userSchema = mongoose.Schema({
    userId: String,
    olinAppsInfo: Object
    //,
    //listings: [listingSchema]
});

module.exports.user = mongoose.model('user',userSchema);
module.exports.userSchema = userSchema;