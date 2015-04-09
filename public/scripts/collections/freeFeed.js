define([
  'backbone',
  'scripts/models/listing',
  'scripts/collections/feed',
], function (Backbone, Listing, Feed) {
  var FreeFeed = Feed.extend({
    url : '/feed/free',
    model: Listing
  });

  return FreeFeed;
});