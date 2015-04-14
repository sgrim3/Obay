define(['jquery'], function ($){
  var utils = {
    ensureOlinAuthenticated: function(onAuth,onErr){
      $.get('/isOlinAuthenticated')
        .done(function(data){
          var isAuth = data.olinAuth;
          if (isAuth) {
            onAuth();
          } else {
            onErr();
          }
        })
        .error(function(){
          onErr();
        });
    },

    sendCarpe: function (model){
      $.get('temporary_email_route');
    },
  };

  return utils;
});