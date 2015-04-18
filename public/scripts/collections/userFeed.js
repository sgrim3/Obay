define([
  'backbone',

  'scripts/models/listing',
  'scripts/collections/feed'
], function (Backbone, Listing, Feed){
  var userFeed = Feed.extend({

    model: Listing,
    socket: window.socket,

    /*Purposely overwriting parent model's url since we have custom functions 
    to fetch/put/post/etc.*/
    url: '', 

    initialize: function(userId){
      this.userId = userId;
      this.url = '/feed/user/' + userId;

      // FIXME: All of the following code is redundant from the Feed model.
      var _this = this;
      /*Use fetch w/reset = true because that indicates that this fetch 
      is populating an empty collection or repopulating a collection. 
      This allows us to bind render in the view onto the nice 'reset' trigger 
      and stick with backbone conventions!*/
      this.fetch({reset: true});

      /*TODO: Change this to feed:create? We are starting from the feed 
      collection so it may make more sense to change the naming convention.*/
      // QUESTION: What does .bind mean in this situation for createListing? 
      this.socket.on('listing:create', this.createListing.bind(_this));
    },

    createListing: function(model){
      if (model.listing_creator === this.userId){
        this.add(model);
      }
    },

  });

  return userFeed;
});
