/*The request module is a node module for sending the GET requests needed to 
interact w/ the olinApps API and venmo API.*/
var request = require("request");

//ALL ROUTES BELOW ARE RESTFUL API ROUTES.

var userData = function(req,res){
    /*Returns the current session info as a JSON. Session stuff is not easily 
    accessed or parsed client side so we do it on the server instead. Maybe 
    change this if we find a way to get cookie info on the client side?*/
    res.json(req.session);
}

var currentUser = function(req,res){
    /*Returns currentUserid associated with session*/
    res.json({userId: req.session.user.userId});
}

var logout = function(req,res){
    req.session.destroy();
    res.end();
}

module.exports.userData = userData;
module.exports.currentUser = currentUser;
module.exports.logout = logout;
