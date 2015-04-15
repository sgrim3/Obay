define([
  'backbone',
], function (Backbone) {
  var BaseModel = Backbone.Model.extend({
    saveWithExtraData: function(extraData, callbacks){
      //this function saves a model and passes extra data along to the server as well. the server will recieve the model object w/ an 'extra' hash added that allows you to send extra data along to the server. Your server route must be prepared to recieve this extra data!
      var modelData = this.toJSON();
      modelData.extraData = extraData;
      this.save(modelData, callbacks);
    },
  });

  return BaseModel;
});
