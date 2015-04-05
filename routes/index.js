//the request module is a node module for sending the GET requests needed to interact w/ the olinApps API and venmo API
var request = require("request");
var Listing = require('../models/listing_model.js').listing;
var User = require('../models/user_model.js').user;
var ensureOlinAuthenticatedServer = require('./auth.js').ensureOlinAuthenticatedServer
var ensureVenmoAuthenticatedServer = require('./auth.js').ensureVenmoAuthenticatedServer

//ALL ROUTES BELOW ARE RESTFUL API ROUTES

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

var isVenmoAuthenticated = function(req,res){
    //returns status of venmo auth. note that venmo is not authenticated if olinapps is not authenticated.
    var onVenmoAuth = function(){
        res.send({venmoAuth:true});
    };
    var onVenmoErr = function(){
        res.send({venmoAuth:false});
    };
    ensureVenmoAuthenticatedServer(req,res,onVenmoAuth,onVenmoErr)
}

var sessionData = function(req,res){
    //returns the current session info as a JSON. Session stuff is not easily accessed or parsed client side so we do it on the server instead. Maybe change this if we find a way to get cookie info on the client side?
    res.send(req.session);
}

var logout = function(req,res){
    req.session.destroy();
    res.end();
}

var venmoPay = function(req,res){
    var onVenmoAuth = function(){
        var post_data = {form:{
            access_token: req.session.venmo_access_token,
            email: req.body.email,
            note: 'Olin Web Club Rox',
            amount: 0.01
        }};
        request.post('https://api.venmo.com/v1/payments', post_data, function(venmo_server_error, response, body){
            var error = JSON.parse(response.body).error;
            if (venmo_server_error || error) {
                if (venmo_server_error) {
                    res.send({success:false, message:'Venmo had an internal server error!'});
                } else {
                    res.send({success:false, message:error.message});
                }
            } else {
                res.send({success:true, message:'Transaction made!'});
            }
        });
    };
    var onVenmoErr = function(){
        res.redirect('/#home')
    };
    ensureVenmoAuthenticatedServer(req,res,onVenmoAuth,onVenmoErr);
};

var venmoAuth = function(req,res){
    //route accessed by venmo API, does initial venmo authentication
    var onSuccess = function(){
        //save token and redirect to home if olin authenticated
        var venmo_access_token = req.query.access_token;
        req.session.venmo_access_token = venmo_access_token;
        res.redirect('/#home');
    };
    var onError = function(){
        //else destroy session and redirect to login
        req.session.destroy();
        res.redirect('/');
    }
    ensureOlinAuthenticatedServer(req,res,onSuccess,onError);
};


var olinAppsAuth = function(req,res){
    //route accessed by olinApps API, does initial olinApps authentication and saves access token
    request('http://www.olinapps.com/api/me?sessionid='+req.body.sessionid,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                console.log('Error! OlinApps says you are not logged in!');
                //if olinapps gives error, redirect to login page again instead of sending res 404, since this is not an internal server error.
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
                            //user does not exist in database yet, create the user
                            var user_info = {userId:userId,olinAppsInfo:olinAppsInfo,listings:[]};
                            var new_user = new User(user_info);
                            new_user.save(function (err) {
                                if (err){
                                    res.status(404).send('Obay server could not create new user!');
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

module.exports.sessionData = sessionData;
module.exports.isOlinAuthenticated = isOlinAuthenticated;
module.exports.isVenmoAuthenticated = isVenmoAuthenticated;
module.exports.venmoPay = venmoPay;
module.exports.venmoAuth = venmoAuth;
module.exports.olinAppsAuth = olinAppsAuth;
module.exports.logout = logout;
