//require my util scripts
var validate_listing = require('./validateInput.js').validate_listing;

var path = require("path");
var email = require("./email.js");
var User = require(path.join(__dirname,"../models/user_model")).user;
var Listing = require(path.join(__dirname,"../models/listing_model")).listing;

//exports is the exported module object
var exports = {};

exports.postListing = function(req, res, next) {
    console.log(req.body);
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
                  //add reference and NOT the document! We don't want to make a copy, just store a reference
                  user.listings.push(newListing._id);
                  user.save(function(err){
                    if (err) {
                      console.error('Could not save listing!');
                      res.status(500).send("Could not save listing!");
                    } else {
                      var callback = function(){
                        res.json(newListing);
                      }
                      if (req.body.extraData && req.body.extraData.toCarpe === 'on'){ 
                        email.sendCarpeEmail(newListing, res, callback);
                      } else {
                        callback();
                      }
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

var editListing = function(req,res){
  //We can't trust listing_creator info sent from serverside so we check our database for the creator instead.
  var onValidListing = function(){
    var listing_id=req.params.id;
    var listing_name= req.body.listing_name;
    var listing_description= req.body.listing_description;
    var listing_image= req.body.listing_image;
    var listing_price= parseFloat(req.body.listing_price.replace(/,/g, ''));
    var listing_open = req.body.listing_open;
    Listing.findOne({_id:listing_id}).exec(function(err, listing){
      var listing_creator = listing.listing_creator;
      //we can trust that req.session.user.userId is accurate because our middleware checks that the userId is not being faked
      if (listing_creator === req.session.user.userId){
        //purposely set each attribute instead of using upsert here because we are only changing some of the attributes. Don't allow users to change the time something was created!
        listing.listing_name = listing_name;
        listing.listing_description = listing_description;
        listing.listing_image = listing_image;
        if (listing.listing_price !== listing_price){
          if (listing.listing_open){
            listing.listing_price = listing_price;
          } else {
            res.status(400).send("You can't change a listing price after the listing is closed!");
          }
        } 
        listing.save(function(err){
          if (err) {
            res.status(500).send('Could not save new listing!');
          } else {
            email.email();
            res.status(200).json(listing);
          }
        });
      } else {
        res.status(401).send("You do not have authorization to edit listings that aren't yours!");
      }
    });
  };
  validate_listing(req,res,onValidListing);
}

var buyListing = function(req,res){
  //any user but the creator may close a listing by buying it, but they may not edit anything else. the update function here should ONLY change the listing_open attribute
  var listing_id=req.params.id;
  //check that listing_creator is not being faked! the only trustworthy info is listing_id
  Listing.findOne({_id:listing_id}).exec(function(err, listing){
    var listing_creator = listing.listing_creator;
    //we can trust that req.session.user.userId is accurate because our middleware checks that the userId is not being faked
    if (listing_creator === req.session.user.userId){
      res.status(401).send("You can't buy your own listings!");
    } else {
      //if user closing listing is not 
      Listing.findByIdAndUpdate(id, {$set:{ listing_open:false }}, 
        function (err, listing) {
        if (err){
          res.status(500).send('Could not buy listing!');
        } else {
          res.status(200).send(listing);
        }
      });
    }
  });
}

exports.updateListing = function(req,res){
    if(req.body.listing_open){
      editListing(req,res);
    } else {
      buyListing(req,res);
    }
}

module.exports = exports;
