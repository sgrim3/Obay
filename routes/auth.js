var request = require("request");

//TODO: check that the server response userid matches the userid on the current cookie so we know that users are really what their cookies say they are
var ensureOlinAuthenticatedServer = function(req,res,success_callback,error_callback){
    //NOT RESTFUL, meant for on server authentication
    request('http://www.olinapps.com/api/me?sessionid='+req.session.olinAppsSessionId,
        function(olin_apps_server_error, response, body) {
            var error = JSON.parse(body).error;
            if (olin_apps_server_error || error) {
                error_callback();
            } else {
                success_callback();
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

module.exports.ensureOlinAuthenticatedServer = ensureOlinAuthenticatedServer;
module.exports.ensureVenmoAuthenticatedServer = ensureVenmoAuthenticatedServer;
