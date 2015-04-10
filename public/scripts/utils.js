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
  };

  return utils;
});