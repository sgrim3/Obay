/*
Backbone Home view
Extends from DestroyableView
Has a mount point to place feed on
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/feed',
  'scripts/views/DestroyableView',
  'scripts/views/FeedView',
  'text!templates/HomeTemplate.html'
], function ($, _, Backbone, Feed, DestroyableView, FeedView, HomeTemplate) {
  var HomeView = DestroyableView.extend({
      tagname: "div",
      id: "HomeView",
    
      initialize:function(info){
        this.template = _.template(HomeTemplate);
        this.params = info.params;

        /*Must instantiate template before rendering subviews, since they 
        mount onto the template! */         
        info.parentDiv.append(this.$el);
        this.render();
      },

      render:function() {
        this.$el.html(this.template());

        // FIXME: feedCollection may not be the best name.
        var feedCollection = new Feed({params: this.params});

        var feedView = new FeedView({
          parentDiv: $('#FeedViewMountPoint'),
          feedCollection: feedCollection
        });
        this.childViews.push(feedView);
        return this;
      },
  });

  return HomeView;
});
