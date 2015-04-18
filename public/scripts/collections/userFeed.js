define([
  'backbone',

  'scripts/models/listing',
  'scripts/collections/feed'
], function (Backbone, Listing, Feed){
  var userFeed = Feed.extend({

    model: Listing,

    /*Purposely overwriting parent model's url since we have custom functions 
    to fetch/put/post/etc.*/
    url: '', 

    initialize: function(userId){

      this.url = '/feed/user/' + userId;

      var _this = this;
      /*Use fetch w/reset = true because that indicates that this fetch 
      is populating an empty collection or repopulating a collection. 
      This allows us to bind render in the view onto the nice 'reset' trigger 
      and stick with backbone conventions!*/
      this.fetch({reset: true});

      // QUESTION: Should we use the global instance of window.socket instead?
      this.socket = io.connect('127.0.0.1');

      /*TODO: Change this to feed:create? We are starting from the feed 
      collection so it may make more sense to change the naming convention.*/
      // QUESTION: What does .bind mean in this situation for createListing? 
      this.socket.on('listing:create', this.createListing.bind(_this));
    },

  });

  return userFeed;
});
