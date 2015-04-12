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

    render:function(info) {
        //must instantiate template before rendering subviews, since they mount onto the template!
        info.parentDiv.append(this.$el);
        this.$el.html(this.template());
        var feedView = new FeedView( {feedModel: new FreeFeed()} );
        this.childViews.push(feedView);
        feedView.render( {parentDiv: $('#FeedViewMountPoint')} );
        return this;
    },

  });

  return SortFreeHomeView;
});