define([
  'jquery', 
  'underscore', 
  'backbone',
  'utils',

  'scripts/models/listing',

  'scripts/views/AddListingView',
  'text!templates/AddListingTemplate.html',
], function ($, _, Backbone, utils, Listing, AddListingView, AddListingTemplate) {
    var PopoverAddListingView = AddListingView.extend({
        tagname: "div",
        id: "PopoverAddListingView",
    	events: {
    	    'click #exitButton': 'broadcoastExitPopoverAddListing',
    	    'click #postButton': 'postListing',
    	},

        initialize: function (){
            var _this = this;
            Backbone.pubSub.on('listing_save:success', _this.redirectHome, _this);
            this.template = _.template(AddListingTemplate);
        },

        broadcoastExitPopoverAddListing: function(){
            Backbone.pubSub.trigger('exitPopoverAddListing');
        },

        broadcoastListingAdded: function(listingModel){
            //called when user makes a new listing from the Popover Add Listing
            Backbone.pubSub.trigger('listingAdded', listingModel);
        },

        postListing: function(e) {
            var thisView = this;
            e.preventDefault();
            var listing_name = $("#addListingName").val();
            var listing_description = $("#addListingDescription").val();
            var listing_image = $("#addListingImage").val();
            var listing_price= $("#addListingPrice").val();
            var toCarpe = $("#carpeButton:checked").val();

            var new_listing = new Listing({
                //listing_creator and listing_time_created is set on the server
                listing_name: listing_name,
                listing_description: listing_description,
                listing_image: listing_image,
                listing_open: true,
                listing_price: listing_price
            });
            new_listing.update();

            //TODO: Change this to a serverside email send! This should not happen until listing is validated.
            // Send an email to Carpe.
            if (toCarpe==="on") {
                utils.sendCarpe();
            }

        },

        redirectHome: function (model){
            this.broadcoastExitPopoverAddListing();
            this.broadcoastListingAdded(model);
        }
    });

    return PopoverAddListingView;
});
