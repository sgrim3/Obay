var request = require("request");
var Listing = require('../models/listing_model.js').listing;
var User = require('../models/user_model.js').user;

var venmoAuth = function(req,res){
  // Route accessed by venmo API, does initial venmo authentication.
  var onSuccess = function(){
    // Save token and redirect to home if olin authenticated.
    var venmo_access_token = req.query.access_token;
    req.session.venmo_access_token = venmo_access_token;
    res.redirect('/#home');
  };
  var onError = function(){
    // Else destroy session and redirect to login.
    req.session.destroy();
    res.redirect('/');
  }
  ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
};


var olinAppsAuth = function(req,res){
  /*Route accessed by olinApps API, does initial olinApps authentication 
  and saves access token.*/
  request('http://www.olinapps.com/api/me?sessionid='+req.body.sessionid,
    function(olin_apps_server_error, response, body) {
      var error = JSON.parse(body).error;
      if (olin_apps_server_error || error) {
        console.log('Error! OlinApps says you are not logged in!');
        /*If olinapps gives error, redirect to login page again 
        instead of sending res 404, since this is not an internal 
        server error.*/
        res.redirect('/');
      } else {
        var userId = JSON.parse(body).user.id;
        var olinAppsInfo = JSON.parse(body).user;
        User.findOne({userId:userId}, function(err, user){
          if (err) {
            console.log('Error! Obay server could not search user models!');
            res.status(404).send('Obay server could not search user models!');
          } else {
            if (user) {
              req.session.user = user;
              req.session.olinAppsSessionId = req.body.sessionid;
              res.redirect('/#home');
            } else {
              // User does not exist in database yet, create the user.
              var user_info = {
                userId:userId,
                olinAppsInfo:olinAppsInfo,
                listings:[],
                venmoPayId:'',
                venmoUserName:''
              };
              var new_user = new User(user_info);
              new_user.save(function (err) {
                if (err){
                  res.status(404)
                    .send('Obay server could not create new user!');
                } else {
                  req.session.user = new_user;
                  req.session.olinAppsSessionId = req.body.sessionid;
                  res.redirect('/#home');
                }
              });
            }
          }
        });
      }
    }
  );
};

var venmoLinkAccount = function (req, res) {
  /*Route accessed by Venmo API, does Venmo authentication and links 
  user account to Venmo.*/
  var venmo_access_token = req.query.access_token;
  request.get('https://api.venmo.com/v1/me?access_token='+venmo_access_token, 
    function(venmo_server_error, venmo_response){
    var error = JSON.parse(venmo_response.body).error;
    if (venmo_server_error || error) {
      if (venmo_server_error) {
        res.status(503).send({
          success:false, 
          message:'Venmo had an internal server error!'
        });
      } else {
        res.status(400).send({success:false, message:error.message});
      }
    } else {
      var olinAuthId = req.session.user.userId;
      var venmoUserId = JSON.parse(venmo_response.body).data.user.id;
      var venmoUserName = JSON.parse(venmo_response.body).data.user.username;
      User.findOne({userId:olinAuthId}, function(err, user){
        if (err) {
          res.status(500).send('Obay server could not search user models!');
        } else {
          user.venmoPayId = venmoUserId;
          user.venmoUserName = venmoUserName;
          user.save(function (err) {
            if (err){
              res.status(500)
                .send("Obay server could not associate" 
                  + "venmo id with your account!");
            } else {
              /*Must update the session user, since the front end 
              user information actually looks at session data to determine 
              current user information.*/
              req.session.user = user;
              res.status(200).redirect('/#account');
            }
          });
        }
      });
    }
  });
}

var venmoRemoveAccount = function(req,res){
  var olinAuthId = req.session.user.userId;
  User.findOne({userId:olinAuthId}, function(err, user){
    if (err) {
      res.status(500).send('Obay server could not search user models!');
    } else {
      user.venmoPayId = '';
      user.venmoUserName = '';
      user.save(function (err) {
        if (err){
          res.status(500)
            .send('Obay server could not unlink venmo id from your account!');
        } else {
          /*Must update the session user, since the front end 
          user information actually looks at session data to determine 
          current user information.*/
          req.session.user = user;
          res.status(200).redirect('/#account');
        }
      });
    }
  });
}
var isOlinAuthenticated = function(req,res){
  //returns status of olinApps Auth
  var onOlinAuth = function(){
    res.send({olinAuth:true});
  };
  var onOlinErr = function(){
    res.send({olinAuth:false});
  };
  ensureOlinAuthenticatedServer(req,res,onOlinAuth,onOlinErr)
}

// var isOlinAuthenticated = function (req, res){
//     //disabled auth for debugging
//     res.send({olinAuth:true});
// }

var isVenmoAuthenticated = function(req,res){
  /*Returns status of venmo auth. Note that venmo is not authenticated 
  if olinapps is not authenticated.*/
  var onVenmoAuth = function(){
    res.send({venmoAuth:true});
  };
  var onVenmoErr = function(){
    res.send({venmoAuth:false});
  };
  ensureVenmoAuthenticatedServer(req,res,onVenmoAuth,onVenmoErr)
}


var olinAuthMiddleware = function(req,res,next){
  request('http://www.olinapps.com/api/me?sessionid='
    +req.session.olinAppsSessionId,
    function(olin_apps_server_error, response, body) {
      var error = JSON.parse(body).error;
      if (olin_apps_server_error || error) {
        res.status(401)
          .send('Log in to OlinApps to access this functionality!');
      } else {
        /*Check that the userid matches the userid associated w/ the session 
        token, to stop authenticated people from editing their cookies to 
        appear to be other users.*/
        var claimedId = req.session.user.userId;
        var sessionAssociatedId = JSON.parse(body).user.id;
        if (claimedId === sessionAssociatedId){
          next();
        } else {
          res.status(401)
            .send('Log in to OlinApps to access this functionality!');
        }
      }
    }
  );
}

var venmoAuthMiddleware = function(req,res,next){
  var onOlinAppSuccess = function(){
    console.log(req.session.venmo_access_token);
    request('https://api.venmo.com/v1/me?access_token='
      +req.session.venmo_access_token,
      function(venmo_server_error, response, body) {
        var error = JSON.parse(response.body).error;
        if (venmo_server_error || error) {
          console.log('Log in to Venmo to access this functionality!');
          res.status(401).send('Log in to Venmo to access this functionality!');
        } else {
          next();
        }
      }
    );
  };
  var onOlinAppError = function(){
    console.log('Log in to OlinApps to access this functionality!');
    res.status(401).send('Log in to OlinApps to access this functionality!');
  }
  //check for olinApps authentication before doing venmo authentication
  ensureOlinAuthenticatedServer(req,res,onOlinAppSuccess,onOlinAppError);
}

var ensureOlinAuthenticatedServer = function(
  req,res,success_callback,error_callback){
  //NOT RESTFUL, meant for on server authentication
  request('http://www.olinapps.com/api/me?sessionid='
    +req.session.olinAppsSessionId,
    function(olin_apps_server_error, response, body) {
      var error = JSON.parse(body).error;
      if (olin_apps_server_error || error) {
        error_callback();
      } else {
        /*Check that the userid matches the userid associated w/ the session 
        token, to stop authenticated people from editing their cookies to 
        appear to be other users.*/
        var claimedId = req.session.user.userId;
        var sessionAssociatedId = JSON.parse(body).user.id;
        if (claimedId === sessionAssociatedId){
          success_callback();
        } else {
          error_callback();
        }
      }
    }
  );
}

var ensureVenmoAuthenticatedServer = function(
  req,res,success_callback,error_callback){
  /*NOT RESTFUL, meant for on server authentication. 
  Does OlinApps auth before doing Venmo auth.*/
  var onOlinAppSuccess = function(){
    request('https://api.venmo.com/v1/me?access_token='
      +req.session.venmo_access_token,
      function(venmo_server_error, response, body) {
        var error = JSON.parse(response.body).error;
        if (venmo_server_error || error) {
          error_callback();
        } else {
          success_callback();
        }
      }
    );
  };
  var onOlinAppError = function(){
    error_callback();
  }
  //check for olinApps authentication before doing venmo authentication
  ensureOlinAuthenticatedServer(req,res,onOlinAppSuccess,onOlinAppError);
}

module.exports.olinAuthMiddleware = olinAuthMiddleware;
module.exports.venmoAuthMiddleware = venmoAuthMiddleware;
module.exports.isOlinAuthenticated = isOlinAuthenticated;
module.exports.isVenmoAuthenticated = isVenmoAuthenticated;
module.exports.venmoLinkAccount = venmoLinkAccount;
module.exports.venmoRemoveAccount = venmoRemoveAccount;
module.exports.venmoAuth = venmoAuth;
module.exports.olinAppsAuth = olinAppsAuth;