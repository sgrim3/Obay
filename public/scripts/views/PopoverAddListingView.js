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
          'click #exitButton': 'broadcastExitPopoverAddListing',
          'click #postButton': 'postListing',
        },

        initialize: function (){
          this.template = _.template(AddListingTemplate);
        },

        broadcastExitPopoverAddListing: function(){
          Backbone.pubSub.trigger('exitPopoverAddListing');
        },

        postListing: function(event) {
          event.preventDefault();
          var self = this;
          var callbacks = {
              success: function(model, response, options) {
                self.broadcastExitPopoverAddListing();
              },
              error: function(model, response, options) {
                $('#error_message').text(response.responseText);
              }
          };
          this.postHelper(callbacks);
        },

    });

    return PopoverAddListingView;
});
