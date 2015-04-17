define([
  'backbone',
  'scripts/models/listing'
], function (Backbone, Listing){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    
    initialize: function(){

      var _this = this;
      this.fetch({reset: true});
      //use fetch w/reset = true because that indicates that this fetch is populating an empty collection or repopulating a collection. This allows us to bind render in the view onto the nice 'reset' trigger and stick with backbone conventions!
      // this.listenTo(Backbone.pubSub, 'feedAddListing', this.addListingToCollection);
    },

    // addListingToCollection: function(broadcastObj){
    //   this.create(broadcastObj.modelInfo,broadcastObj.extraData,broadcastObj.callbacks)
    // },
    
    // create: function(modelInfo, extraData, callback){
    //   /*Overwrites backbone create function. 
    //   Creates model, saves it to server, adds it to current collection, 
    //   and calls callbacks.*/
    //   var _this = this;
    //   var newSuccessCallback = function(model, response, options){
    //     _this.add(model);
    //     callback.success.call(callback.success, model, response, options);
    //   };
    //   var newCallback = {
    //     error: callback.error,
    //     success: newSuccessCallback,
    //   };
    //   var newListing = new this.model(modelInfo)
    //   newListing.saveWithExtraData(extraData,newCallbacks);
    // },
  
  });

  return Feed;
});
