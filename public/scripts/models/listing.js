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

    initialize: function initialize() {
      console.log('initializing model');
      var _this = this;
      window.socket.on('listing:update', this.updateListing.bind(_this));
    },

    updateListing: function(model){
      //sets this instance of the model to have new info
      this.set(model);
      console.log('socketlisting:broadcast');
      // console.log(model);
    },
  });

  return Listing;
});
