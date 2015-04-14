//require my util scripts
var validate_listing = require('./validateInput.js').validate_listing;

var path = require("path");
var email = require("./email.js");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//exports is the exported module object
var exports = {};

exports.postListing = function (req, res) {
    var onValidListing = function(){
        if (req.body.listing_image){
          var listing_image = req.body.listing_image;
        } else {
          var listing_image = '/images/default_listing_image.jpg';
        }
        var newListing = new Listing({
            listing_name: req.body.listing_name,
            listing_description: req.body.listing_description,
            listing_image: listing_image,
            listing_creator: req.session.user.userId,
            listing_time_created: Date.now(),
            listing_open: true,
            listing_price: parseFloat(req.body.listing_price.replace(/,/g, ''))
        });
        // Save new listing to database
        newListing.save(function(err){
            if(err){
                console.error('Could not save listing!');
                res.status(500).send("Could not save listing!");
            } else {
              User.findOne({userId: req.session.user.userId}).exec(function(err, user){
                if (err) {
                  console.error('Could not find User!');
                  res.status(500).send("Could not find User!");
                } else {
                  user.listings.push(newListing);
                  user.save(function(err){
                    if (err) {
                      console.error('Could not save listing!');
                      res.status(500).send("Could not save listing!");
                    } else {
                      res.send(newListing);
                    }
                  });
                }
              });
            }
        }); 
    };
    validate_listing(req, res, onValidListing);
};


exports.getListing = function(req, res) {
    var id=req.params.id;
    var currentUser= req.session.user.userId;

    Listing.findOne({_id:id}).exec(function (err, item) {
        if (err) {
            console.error("Could not search Listings!");
            res.status(500).send("Could not search Listings!");
        }
        else {
            res.send({"item":item, "currentUser":currentUser}); 
        }
    });
}

exports.updateListing = function(req,res){
    var id=req.params.id;
    var listing_creator= req.body.listing_creator;
    var listing_name= req.body.listing_name;
    var listing_description= req.body.listing_description;
    var listing_image= req.body.listing_image;
    var listing_time_created= Date.now();

    //FIXME: Why doesn't .replace work???
    //var listing_price= parseFloat(req.body.listing_price.replace(/,/g, ''));
    var listing_price= parseFloat(req.body.listing_price);

    var listing_open = req.body.listing_open;

    //check that listing_open is not undefined
    //need to come back to this if statements so it's not so dumb
    if(!listing_open){
        //handle buy sell, the listing has been closed
        if (req.session.user.userId === listing_creator){
          //disallow user from closing their own listings, but we will add the 'delete listing' option later
          res.status(400).send("You can't buy your own listing!");
        } else {
          Listing.findByIdAndUpdate(id, {$set:{ listing_open:listing_open }}, 
              function (err, listing) {
              if (err){
                  console.log("dz Buy Error");
                  return handleError(err);
              } else {
                console.log("dz Buy Success");
                console.log(listing);
                res.status(200).send(listing);
              }
          });
        }
    }
    else{
        Listing.findByIdAndUpdate(id, {$set:{ listing_name:listing_name,
            listing_description:listing_description,
            listing_image:listing_image,
            listing_time_created:listing_time_created,
            listing_price:listing_price,
            listing_creator:real_listing_creator,
            listing_open:listing_open }}, 
            function (err, listing) {
            if (err){
                console.error('Could not edit listing!');
                res.status(500).send("Could not edit listing!");
            } else {
                res.send(listing);
            }
        });;
    }
}


module.exports = exports;

