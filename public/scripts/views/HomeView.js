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
        this.criteria = info.criteria;
        this.feedType = info.feedType;
        /*Must instantiate template before rendering subviews, since they 
        mount onto the template! */         
        info.parentDiv.append(this.$el);
        this.render();
      },

      render:function() {
        this.$el.html(this.template(this));


        // Check to see if a feedCollection instance already exists.
        if (typeof window.dataHolder.feedCollection == 'undefined') {
          window.dataHolder.feedCollection = new Feed({
            criteria: this.criteria,
          });
        } else {
          window.dataHolder.feedCollection.criteria = this.criteria;
          //the fetch to actually update happens when a new feedview is instantiated
        }

        var feedView = new FeedView({
          parentDiv: $('#FeedViewMountPoint'),
          collection: window.dataHolder.feedCollection
        });
        this.childViews.push(feedView);
        return this;
      },
  });

  return HomeView;
});
