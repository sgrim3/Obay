/*
Backbone view for popup add listing
Extends from AddListingView
broadcasts listing over feed
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/models/listing',
  'scripts/views/AddListingView',
  'text!templates/AddListingTemplate.html',
], function ($, _, Backbone, Listing, 
    AddListingView, AddListingTemplate) {
    var PopoverAddListingView = AddListingView.extend({
        tagname: "div",
        id: "PopoverAddListingView",

        events: {
          'click #exitButton': 'broadcastExitPopoverAddListing',
          'click #postButton': 'postListing',
        },

        broadcastExitPopoverAddListing: function(){
          Backbone.pubSub.trigger('exitPopoverAddListing');
        },

        postListing: function(event){
          var self = this;
          var onSuccess = function(response){
            self.broadcastExitPopoverAddListing();
          };
          var onErr = function(response){
            if (response.status === 401) {
                window.location.replace('/');
            } else {
                $('#error_message').text(response.responseText);
            }
          };
          this.postHelper(event, onSuccess, onErr);
        },

    });

    return PopoverAddListingView;
});
