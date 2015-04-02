//require my modules
var ensureOlinAuthenticatedServer = require('./auth.js').ensureOlinAuthenticatedServer
var ensureVenmoAuthenticatedServer = require('./auth.js').ensureVenmoAuthenticatedServer
var path = require("path");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;


var listings = {};

//gets list of all twotes and sorts by timestamp
listings.list = function(req, res) {
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

//adding a listing to list
listings.add = function (req, res) {
    var onSuccess = function(){
        var name = req.body.name_listing;
        var description= req.body.description_listing;
        var image = req.body.image_listing;
        var creator = req.body.creator_listing;
        var price = req.body.price_listing;

        var newListing = new Listing({
            item_name: name,
            item_description: description,
            item_image: image,
            item_creator: creator,
            item_timeCreated: Date.now(),
            item_open: true,
            item_price: price
        });
        // Save new event to database
        newListing.save(function(err){
            if(err){
                console.error('Cant add topic');
                res.status(500).send("Couldn't add topic");
            }
            console.log(newListing)
            res.send(newListing);
        }); 
    };
    var onError = function(){
        res.status(401).send('Log in to OlinApps to access this functionality!');
    }
    ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
};



module.exports = listings;
