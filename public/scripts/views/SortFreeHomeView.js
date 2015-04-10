define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/views/HomeView'
], function ($, _, Backbone, HomeView) {
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
