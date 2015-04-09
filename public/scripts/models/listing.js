define([
  'backbone',
], function (Backbone) {
    var Listing = Backbone.Model.extend({

        defaults: {
            item_name: '',
            item_description: '',
            item_image: '',
            item_creator: '',
            item_timeCreated: 0,
            item_open: true,
            item_price: 0
        },

        urlRoot : "http://127.0.0.1:3000/listing/"

    });

    return Listing;
});