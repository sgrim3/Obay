define([
  'backbone',

  'scripts/models/listing',
  'scripts/collections/feed'
], function (Backbone, Listing, Feed){
  var userFeed = Feed.extend({
      url: '', //purposely overwriting parent model's url since we have custom functions to fetch/put/post/etc
      model: Listing,
      initialize: function(userId){
        this.url = '/feed/user/'+userId;
      },
  });

  return userFeed;
});
