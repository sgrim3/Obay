/*
Backbone listing model
Assigns defaults
Initializes using urlRoot
*/

define([
  'jquery',
  'backbone',
  'scripts/models/baseModel',
], function ($, Backbone, BaseModel) {
  var url = "http://"+window.PORT+":3000/listing/";
  var Listing = BaseModel.extend({
    idAttribute: '_id',

    defaults: {
        listing_name: '',
        listing_description: '',
        listing_image: '',
        listing_creator: '',
        listing_timeCreated: 0,
        listing_open: true,
        listing_price: 0
    },
    
    urlRoot : url,

    intialize: function intialize() {
      var _this = this;
      window.socket.on('listing:update', this.updateListing.bind(_this));
    },

    updateListing: function(model){
      console.log('socketlisting:broadcast');
      var updated_model = this.get(model._id);
      updated_model.set(model);
    },
  });

  return Listing;
});
