define([
  'jquery',
  'backbone',
  'scripts/models/baseModel',
], function ($, Backbone, BaseModel) {
  var url = "http://"+window.PORT+":3000/listing/";
  console.log(window.PORT);
  console.log(url);
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
      console.log(this.urlRoot);
    }
  });

  return Listing;
});
