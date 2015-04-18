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
            this.collection = info.feedCollection;
            this.listenTo(this.collection, 'reset', this.render);
            this.listenTo(this.collection, 'add', this.addListingView);
        },

        render: function (){
            var self = this;
            this.collection.models.forEach(function(m){
              var collapsedListingView = new CollapsedListingView({
                  parentDiv: self.$el,
                  model: m,
                  collection: this.collection,
              });
              self.childViews.push(collapsedListingView);
            });
        },

        addListingView: function(listing){
            var collapsedListingView = new CollapsedListingView({
              parentDiv: this.$el, 
              model: listing,
              collection: this.collection});
            this.childViews.push(collapsedListingView);
        },

    });

    return FeedView;
});
