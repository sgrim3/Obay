var request = require("request");
var Listing = require('../models/listing_model.js').listing;
var User = require('../models/user_model.js').user;

var venmoPay = function(req,res){
  /*Use mongoose to retrieve model from database. 
  We can't trust information sent by user besides the objectId.*/
  Listing.findOne({_id:req.body.id}).exec(function (err, listing){
    if (err) {
      console.error("SG|/routes/payment.js|venmoPay|find listing error");
      console.log(err);
      res.status(500).send("Could not search through listings!");
    } else {
      /*Once you have listing data, look up the seller to find out 
      what their payId is.*/
      User.findOne({userId: listing.listing_creator}).exec(function (err, user){
        if (err) {
          console.error("SG|/routes/payment.js|venmoPay|find user error");
          console.log(err);
          res.status(500).send("Could not find listing creator to pay!");
        } else {
          var venmoPayId = user.venmoPayId;
          var post_data = {form:{
            access_token: req.session.venmo_access_token,
            user_id: venmoPayId,
            email: req.body.email,
            note: 'Obay donation for '+listing.listing_name+'!',
            amount: listing.listing_price,
          }};
          request.post('https://api.venmo.com/v1/payments', post_data, 
            function(venmo_server_error, response, body){
            var error = JSON.parse(response.body).error;
            if (venmo_server_error || error) {
              if (venmo_server_error) {
                res.status(503)
                  .send({
                    success:false, 
                    message:'Venmo had an internal server error!'
                  });
              } else {
                res.status(400).send({success:false, message:error.message});
              }
            } else {
              res.status(200).send({success:true, message:'Transaction made!'});
            }
          });
        }
      });
    }
  });
};

var setVenmoPayRedirect = function(req,res){
  req.session.venmoRedirectUrl = req.body.url;
  res.status(200).end();
}

var venmoRedirect = function(req,res){
  // Saves venmo access token and redirects to url set in setVenmoPayRedirect.
  var venmo_access_token = req.query.access_token;
  req.session.venmo_access_token = venmo_access_token;
  res.redirect(req.session.venmoRedirectUrl);
}

module.exports.venmoPay = venmoPay;
module.exports.setVenmoPayRedirect = setVenmoPayRedirect;
module.exports.venmoRedirect = venmoRedirect;