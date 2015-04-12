define([
  'backbone',
], function (Backbone) {
  var Listing = Backbone.Model.extend({

    defaults: {
        listing_name: '',
        listing_description: '',
        listing_image: '',
        listing_creator: '',
        listing_timeCreated: 0,
        listing_open: true,
        listing_price: 0
    },

    update: function (){
      var self = this;
      this.save(null, {
        success: function(model, response, options) {
          // Associate server save time and user with the model.
          model.listing_time_created = response.listing_time_created;
          model.listing_creator = response.listing_creator;
          Backbone.pubSub.trigger("listing_save:success", model);
        error: function(model, response, options) {
          Backbone.pubSub.trigger("listing_save:error", response);
        }
      });
    },

    urlRoot : "http://127.0.0.1:3000/listing/"
  });

  return Listing;
});