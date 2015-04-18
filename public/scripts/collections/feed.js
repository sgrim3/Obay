define([
  'backbone',
  'scripts/models/listing',
  '/socket.io/socket.io.js'
], function (Backbone, Listing, io){

  var Feed = Backbone.Collection.extend({
    url : '/feed',
    model: Listing,
    socket: window.socket,
    
    initialize: function(){
      var _this = this;
      /*Use fetch w/reset = true because that indicates that this fetch 
      is populating an empty collection or repopulating a collection. 
      This allows us to bind render in the view onto the nice 'reset' trigger 
      and stick with backbone conventions!*/
      /*SUGGESTION: The feed can't really 'change' that much. It should cover
      of your cases.*/
      this.fetch({reset: true});

      /*TODO: Change this to feed:create? We are starting from the feed 
      collection so it may make more sense to change the naming convention.*/
      // QUESTION: What does .bind mean in this situation for createListing? 
      this.socket.on('listing:create', this.createListing.bind(_this));
    },

    createListing: function(model){
      this.add(model);
    },

  });
  return Feed;
});
