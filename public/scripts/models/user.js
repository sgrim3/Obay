define([
  'backbone',
  'scripts/models/baseModel',
], function (Backbone, BaseModel) {
  var User = BaseModel.extend({
    defaults: {
      userId: '',
      olinAppsInfo: {},
      listings: [],
      venmoUserName: '',
      venmoUserId: '',
    },
    // Use userId to uniquely identify user objects.
    idAttribute: 'userId',
    fetch: function(callback){
      var _this = this;
      $.get('/userData')
        .done(function(data){
          _this.set(data.user);

          // FIXME: Change this into an emit.
          callback();
        })
    }
  });
  return User;
});