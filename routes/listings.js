//require my modules
var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;


var listings = {};

//gets list of all twotes and sorts by timestamp
listings.list = function(req, res) {
	// var currentUser = req.session.username;
	// var currentUser = (JSON.stringify (req.user.displayName)).replace(/\"/g, "");
	// console.log(currentUser)

	Listing.find().sort({"item_timeCreated": -1}).exec(function (err, listings) {
		if (err) {
			return console.log ("Something broke");
		}
		else {

			console.log(listings);
			res.send (listings);	
		}
	})
};

//adding a twote to list
listings.add = function (req, res) {

	var name = req.body.name_listing;
	var description= req.body.description_listing;
	var image = req.body.image_listing;
	var creator = req.body.creator_listing;

	var newListing = new Listing({
		item_name: name,
		item_description: description,
		item_image: image,
		item_creator: creator,
		item_timeCreated: Date.now(),
		item_open: True
	});

	// Save new event to database
	newListing.save(function(err){
		if(err){
			console.error("Can't add topic");
			res.status(500).send("Couldn't add topic");
		}

		console.log(newListing)
		res.send(newListing);
	}); 

};

module.exports = listings;