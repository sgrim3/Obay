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
      $.get('/userData')
        .done(function(data){
          self.set(data.user);
          callback();
        })
    }
  });

  return User;
});
