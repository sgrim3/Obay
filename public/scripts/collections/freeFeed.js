/*
Backbone free feed collection 
*/

define([
  'backbone',

  'scripts/models/listing',
  'scripts/collections/feed'
], function (Backbone, Listing, Feed){
  var FreeFeed = Feed.extend({
      url : '/feed/free',
      model: Listing,
  
      createListing: function(model){
        if (model.listing_price === 0){
          this.add(model);
        }
      },

  });
  return FreeFeed;
});
