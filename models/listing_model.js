var mongoose = require('mongoose');

//TODO- change item_creator to reference to other user

var userSchema = require('./user_model.js').userSchema;

var listingSchema = mongoose.Schema({
	item_name: String,
    item_description: String, 
    item_image: String,
    item_creator: String,
    //item_creator: { type: Number, ref: 'userSchema' },
    item_timeCreated: Number,
    item_open: Boolean
});

module.exports.listing = mongoose.model('listing',listingSchema);
module.exports.listingSchema = listingSchema;