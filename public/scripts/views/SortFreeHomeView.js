/*
Backbone view for mounting free feed
Extends from HomeView
*/

//QUESTION: Is this view still necessary?

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/freeFeed',
  'scripts/views/HomeView',
  'scripts/views/FeedView',
], function ($, _, Backbone, FreeFeed, HomeView, FeedView) {
  var SortFreeHomeView = HomeView.extend({
    tagname: "div",
    id: "SortFreeHomeView",

    render:function() {
        /*Must instantiate template before rendering subviews, 
        since they mount onto the template!*/
        this.$el.html(this.template());
        var feedView = new FeedView({
          parentDiv: $('#FeedViewMountPoint'),
          feedCollection: new FreeFeed(),
        });
        this.childViews.push(feedView);
        return this;
    },

  });

  return SortFreeHomeView;
});
