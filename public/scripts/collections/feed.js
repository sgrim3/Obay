define([
  'backbone',
  'scripts/models/listing'
], function (Backbone, Listing){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    
    initialize: function(){

      var _this = this;
      this.fetch({
        // Fetch must be called asynchronously to work!
        // NOTE: In this case, 'data' isn't even used.
        success: function(data){

          _this.trigger("feed:created", _this);
          // _this.models.forEach(function(m){
            // var collapsedListingView = new CollapsedListingView({model: m});
            // feedview.childViews.push(collapsedListingView);
            // collapsedListingView.render({parentDiv: feedview.$el}); 
          // });
        },
        error: function(){
          //TODO: display error in a div
          // console.log('error!');
        }
      });


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