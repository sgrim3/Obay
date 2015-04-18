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
      this.fetch({reset: true});
      //use fetch w/reset = true because that indicates that this fetch is populating an empty collection or repopulating a collection. This allows us to bind render in the view onto the nice 'reset' trigger and stick with backbone conventions!
      this.socket = io.connect('127.0.0.1');
      var self = this;
      console.log(self);
      this.socket.on('listing:create', this.createListing.bind(self));
    },

    createListing: function(model){
      console.log(model);
      console.log('create listing called!');
      console.log(this);
      this.add(model);
    },

  });
  return Feed;
});
