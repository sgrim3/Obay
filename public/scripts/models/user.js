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

    // QUESTION: Why is this fetch overwritten?
    fetch: function(){
      var _this = this;
      $.get('/userData')
        .done(function(data){
          _this.set(data.user);
        })
    }
  });
  return User;
});