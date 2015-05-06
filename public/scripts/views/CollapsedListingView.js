/*
Backbone view for one listing on the feed
Extends from DestroyableView
*/

define([
  'jquery', 
  'underscore', 
  'backbone',

  'scripts/models/listing',
  'scripts/models/user',

  'scripts/views/DestroyableView',
  'text!templates/CollapsedListingTemplate.html'
], function ($, _, Backbone, Listing, User, DestroyableView, CollapsedListingTemplate) {
  var CollapsedListingView = DestroyableView.extend({
    tagname: "div",
    id: "CollapsedListingView",

    events: {
      'click #deleteButton': 'deleteListing'
    },

    initialize: function(data){
      data.parentDiv.prepend(this.$el);
      this.template = _.template(CollapsedListingTemplate);
      this.model = data.model;
      this.currentUser = data.currentUser;
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.destroy);
      this.render();
    },

    getThumbnailUrl: function(url){
      if (this.isImgurLink(url)){
        // return url.substring(0,url.length-4)+'b'+url.substring(url.length-4,url.length);
        return url
          .substring(0,url.length-4)+url.substring(url.length-4,url.length);
      } else {
        return url;
      }
    },

    isImgurLink: function(url){
      if (url.match(/^(http:\/\/)?(i\.imgur\.com)/)){
        
        /*Code intentionally written this way and is NOT redundant. Takes 
        advantage of javascript's 'truthiness', where null is false and 
        non-empty values are true. Could use ternary operator if ya really 
        want a one liner.*/
        return true;
      } else {
        return false;
      }
    },

    render: function (){
      var listing_attrs = this.model.attributes;
      var isCreator = "undefined";
      
      if (this.currentUser === listing_attrs.listing_creator) {
        isCreator = true;
      }

      listing_attrs.listing_thumbnail = this.getThumbnailUrl(
        listing_attrs.listing_image
      );

      this.$el.html(this.template($.extend(
        {},
        listing_attrs,
        {isCreator: isCreator}
      )));

      return this;
    },

    deleteListing: function deleteListing(e) {
      e.preventDefault();
      var _this = this;
      if (confirm("Are you sure you want to remove this listing from your history?")) {
        $.ajax({
          url: '/listing/'+_this.model.id,
          type: 'DELETE',
        })
      } else {
      }
    }
  });

  return CollapsedListingView;
});
