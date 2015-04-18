define([
  'backbone',
  'scripts/models/listing',
  '/socket.io/socket.io.js'
], function (Backbone, Listing, io){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    
    initialize: function(){
      var _this = this;
      /*Use fetch w/reset = true because that indicates that this fetch 
      is populating an empty collection or repopulating a collection. 
      This allows us to bind render in the view onto the nice 'reset' trigger 
      and stick with backbone conventions!*/
      this.fetch({reset: true});
      this.socket = io.connect('127.0.0.1');
      var _this = this;
      this.socket.on('listing:create', this.createListing.bind(_this));
      this.socket.on('listing:update', this.updateListing.bind(_this));
      /*TODO: Change this to feed:create? We are starting from the feed 
      collection so it may make more sense to change the naming convention.*/
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
