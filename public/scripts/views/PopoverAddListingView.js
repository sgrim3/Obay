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
            this.template = _.template(AddListingTemplate);
        },

        broadcastExitPopoverAddListing: function(){
            Backbone.pubSub.trigger('exitPopoverAddListing');
        },

        broadcastListingAdded: function(listingModel){
            //called when user makes a new listing from the Popover Add Listing
            Backbone.pubSub.trigger('listingAdded', listingModel);
        },

        postListing: function(event) {
          var self = this;
          var callbacks = {
              success: function(model, response, options) {
                self.broadcastExitPopoverAddListing();
                self.broadcastListingAdded(model);
              },
              error: function(model, response, options) {
                $('#error_message').text(response.responseText);
              }
          };
          this.postHelper(event, callbacks)
        },

    });

    return PopoverAddListingView;
});
