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
  var url = "http://"+window.location.host+"/listing/";
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
      var _this = this;

      window.socket.on('listing:update' + this.attributes._id, 
        this.updateListing.bind(_this));
      window.socket.on('listing:bought' + this.attributes._id, 
        this.boughtListing.bind(_this));

    },

    updateListing: function(model){
      //sets this instance of the model to have new info
      this.set(model);
    },

    boughtListing: function(model){
      //sets this instance of the model to listing_open:false
      this.set(model);
    },
  });

  return Listing;
});
