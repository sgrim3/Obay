//the request module is a node module for sending the GET requested needed to interact w/ the olinApps API
var request = require("request");
var Listing = require('../models/listing_model.js').listing;
var User = require('../models/user_model.js').user;

var ensureAuthenticated = function(req,res,callback){
    //calls callback function if user is authenticated and olinApps sessionId is still valid, redirects to login page otherwise.
    request('http://www.olinapps.com/api/me?sessionid='+req.session.olinAppsSessionId,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                req.session.user = null;
                req.session.olinAppsSessionId = null;
                res.redirect('/');
            } else {
                callback();
            }
        }
    );
}

var loginPage = function(req,res){
    //redirect to /home if user is logged in and OlinApps session is authenticated.
    request('http://www.olinapps.com/api/me?sessionid='+req.session.olinAppsSessionId,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                req.session.user = null;
                req.session.olinAppsSessionId = null;
                res.render('login');
            } else {
                res.redirect('/home');
            }
        }
    );
};

var logout = function(req,res){
    req.session.user = null;
    req.session.olinAppsSessionId = null;
    res.end();
}

var home = function(req,res){
    var callback = function(){
        var image_url = 'http://www.olinapps.com'+req.session.user.olinAppsInfo.thumbnail;
        res.render('home', {image_url:image_url});
    };
    ensureAuthenticated(req,res,callback);
};

var olinAppsAuth = function(req,res){
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
                            res.redirect('/home');
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
                                    res.redirect('/home');
                                }
                            });
                        }
                    }
                });
            }
        }
    );
};

module.exports.home = home;
module.exports.loginPage = loginPage;
module.exports.olinAppsAuth = olinAppsAuth;
module.exports.logout = logout;
