/*
Backbone view for entire feed
Renders collapsed listing views for each item in the feed
Extends from DestroyableView
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/DestroyableView',
  'scripts/views/CollapsedListingView',

], function ($, _, Backbone, DestroyableView, CollapsedListingView) {
  var FeedView = DestroyableView.extend({
    tagname: "div",
    id: "FeedView",

    // TODO: Change 'info' into something more descriptive.
    initialize:function (info) {
      info.parentDiv.append(this.$el);
      
      this.currentUser = info.currentUser;
      this.collection = info.collection;

      this.collection.fetch({reset: true});

      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'add', this.addListingView);
    },

    renderOne: function renderOne(listing) {
      var collapsedListingView = new CollapsedListingView({
        parentDiv: this.$el,
        model: listing,
        collection: this.collection,
        currentUser: this.currentUser,
      });

      this.childViews.push(collapsedListingView);
    },

    render: function (){
      var _this = this;
      this.collection.models.forEach(function(listing){
        _this.renderOne(listing);
      });
    },

    addListingView: function(listing){
      this.renderOne(listing);
    },
  });

  return FeedView;
});
