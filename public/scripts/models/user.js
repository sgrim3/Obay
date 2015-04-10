define([
  'backbone',
], function (Backbone) {
  var User = Backbone.Model.extend({
    defaults: {
      userId: '',
      olinAppsInfo: {},
      listings: [],
      venmoUserName: '',
      venmoUserId: '',
    },
    //use userId to uniquely identify user objects
    idAttribute: 'userId',
    fetch: function(callback){
      var self = this;
      $.get('/sessionData')
        .done(function(data){
          self.userData = data.user;
          callback();
        })
    }
  });

  return User;
});
