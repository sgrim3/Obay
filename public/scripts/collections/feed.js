define([
  'backbone',
  'scripts/models/listing'
], function (Backbone, Listing){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    initialize: function(){
      this.listenTo(Backbone.pubSub, 'feedAddListing', this.addListingToCollection);
    },
    addListingToCollection: function(broadcastObj){
      this.create(broadcastObj.modelInfo,broadcastObj.extraData,broadcastObj.callbacks)
    },
    create: function(modelInfo,extraData,callbacks){
      //overwrites backbone create function. Creates model, saves it to server, adds it to current collection, and calls callbacks
      var self = this;
      var new_success_callback = function(model, response, options){
        self.add(model);
        callbacks.success.call(callbacks.success, model, response, options);
      };
      var new_callbacks = {
        error: callbacks.error,
        success: new_success_callback,
      };
      var newListing = new this.model(modelInfo)
      newListing.saveWithExtraData(extraData,new_callbacks);
    },
  });

  return Feed;
});
