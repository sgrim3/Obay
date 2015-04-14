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

        initialize:function (data) {
            this.listenTo(Backbone.pubSub, 'listingAdded', this.addListingView);
            this.collection = data.feedModel;
        },

        render: function (info){
            //mount to parentDiv passed on creation
            info.parentDiv.append(this.$el);
            var feedview = this;
            this.collection.fetch({
                //fetch must be called asynchronously to work!
                success: function(data){
                    feedview.collection.models.forEach(function(m){
                        var collapsedListingView = new CollapsedListingView({model: m});
                        feedview.childViews.push(collapsedListingView);
                        collapsedListingView.render({parentDiv: feedview.$el}); 
                    });
                },
                error: function(){
                    //TODO: display error in a div
                    console.log('error!');
                }
            });
            return this;
        },

        addListingView: function(model){
            var collapsedListingView = new CollapsedListingView({model: model});
            this.childViews.push(collapsedListingView);
            this.collection.add(collapsedListingView);
            collapsedListingView.render({parentDiv: this.$el}); 
        },
    });

    return FeedView;
});
