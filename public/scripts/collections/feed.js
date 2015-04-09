define([
  'backbone',
  'scripts/models/listing'
], function (Backbone, Listing){

  var Feed = Backbone.Collection.extend({
      url : '/feed',
      model: Listing
  });

  return Feed;
});