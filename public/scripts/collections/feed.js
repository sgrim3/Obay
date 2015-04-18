define([
  'backbone',
  'scripts/models/listing',
  '/socket.io/socket.io.js'
], function (Backbone, Listing, io){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    
    initialize: function(info){
      console.log(info);
      var _this = this;
      /*Use fetch w/reset = true because that indicates that this fetch 
      is populating an empty collection or repopulating a collection. 
      This allows us to bind render in the view onto the nice 'reset' trigger 
      and stick with backbone conventions!*/
      this.fetch({reset: true});

      window.socket.on('listing:create', this.createListing.bind(_this));
      window.socket.on('listing:update', this.updateListing.bind(_this));
      /*TODO: Change this to feed:create? We are starting from the feed 
      collection so it may make more sense to change the naming convention.*/
      /*SUGGESTION: The feed can't really 'change' that much. It should cover
      of your cases.*/
    },

    createListing: function(model){
      this.add(model);
    },

    updateListing: function(model){
      var updated_model = this.get(model._id);
      updated_model.set(model);
    },

  });
  return Feed;
});
