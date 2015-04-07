var request = require("request");

var olinAuthMiddleware = function(req,res,next){
    request('http://www.olinapps.com/api/me?sessionid='+req.session.olinAppsSessionId,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                res.status(401).send('Log in to OlinApps to access this functionality!');
            } else {
                //check that the userid matches the userid associated w/ the session token, to stop authenticated people from editing their cookies to appear to be other users
                var claimedId = req.session.user.userId;
                var sessionAssociatedId = JSON.parse(body).user.id;
                if (claimedId === sessionAssociatedId){
                    next();
                } else {
                    res.status(401).send('Log in to OlinApps to access this functionality!');
                }
            }
        }
    );
}

var ensureOlinAuthenticatedServer = function(req,res,success_callback,error_callback){
    //NOT RESTFUL, meant for on server authentication
    request('http://www.olinapps.com/api/me?sessionid='+req.session.olinAppsSessionId,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                error_callback();
            } else {
                //check that the userid matches the userid associated w/ the session token, to stop authenticated people from editing their cookies to appear to be other users
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

var ensureVenmoAuthenticatedServer = function(req,res,success_callback,error_callback){
    //NOT RESTFUL, meant for on server authentication. Does OlinApps auth before doing Venmo auth.
    var onOlinAppSuccess = function(){
        request('https://api.venmo.com/v1/me?access_token='+req.session.venmo_access_token,
            function(venmo_server_error, response, body) {
                var error = JSON.parse(response.body).error;
                if (venmo_server_error || error) {
                    error_callback();
                //    res.redirect('https://api.venmo.com/v1/oauth/authorize?client_id=2473&scope=make_payments%20access_profile');
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
module.exports.ensureOlinAuthenticatedServer = ensureOlinAuthenticatedServer;
module.exports.ensureVenmoAuthenticatedServer = ensureVenmoAuthenticatedServer;
