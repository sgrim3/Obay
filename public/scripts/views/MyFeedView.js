/*
Backbone view for Account page
Extends from DestroyableView
*/

define([
  'jquery', 
  'underscore', 
  'backbone',
  'scripts/collections/feed',
  'scripts/views/FeedView',
  'scripts/views/DestroyableView',
  'text!templates/MyFeedTemplate.html'
], function ($, _, Backbone, Feed, FeedView, 
  DestroyableView, MyFeedTemplate) {
  var MyFeedView = DestroyableView.extend({

    tagname: "div",
    id: "myFeedView",

    initialize: function(options){
      options.parentDiv.append(this.$el);
      this.template = _.template(MyFeedTemplate);
      this.userId = options.userId;
      this.render();
    },

    render:function(){
      this.$el.html(this.template());

      if (typeof window.dataHolder.feedCollection == 'undefined') {
        window.dataHolder.feedCollection = new Feed({
          criteria:{
            listing_creator: this.userId,
          },
        });
      } else {
        window.dataHolder.feedCollection.criteria = {listing_creator: this.userId};
        //the fetch to actually update happens when a new feedview is instantiated
      }

      if (typeof window.dataHolder.boughtFeedCollection == 'undefined') {
        window.dataHolder.boughtFeedCollection = new Feed({
          criteria:{
            listing_buyer: this.userId,
          },
        });
      } else {
        window.dataHolder.boughtFeedCollection.criteria = {listing_buyer: this.userId};
        //the fetch to actually update happens when a new feedview is instantiated
      }

      var feedView = new FeedView({
        parentDiv: $('#MyFeedViewMountPoint'),
        collection: window.dataHolder.feedCollection,
        currentUser: this.userId,
      });

      var boughtView = new FeedView({
        parentDiv: $('#MyFeedBoughtItems'),
        collection: window.dataHolder.boughtFeedCollection,
        currentUser: this.userId,
      });

      console.log(boughtView);

      this.childViews.push(feedView);
      this.childViews.push(boughtView);
      return this;
    },
  });

  return MyFeedView;
});
