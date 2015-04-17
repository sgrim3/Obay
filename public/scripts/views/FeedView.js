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

        // TODO: Change 'data' into something more descriptive.
        initialize:function (data) {
            this.collection = data.feedCollection;
            data.parentDiv.append(this.$el);
            this.listenTo(this.collection, "feed:created", this.render);

            // this.collection.fetch();
        },

        render: function (){
            console.log("FeedView rendered.");

            var _this = this;
            this.collection.models.forEach(function(m){
                var collapsedListingView = new CollapsedListingView({
                    parentDiv: _this.$el,
                    model: m,
                });
                _this.childViews.push(collapsedListingView);

                // collapsedListingView.render({parentDiv: _this.$el}); 
            });


            //mount to parentDiv passed on creation
            // info.parentDiv.append(this.$el);
            

            // var feedview = this;
            // this.collection.fetch({
            //     //fetch must be called asynchronously to work!
            //     success: function(data){
            //         feedview.collection.models.forEach(function(m){
            //             var collapsedListingView = new CollapsedListingView({model: m});
            //             feedview.childViews.push(collapsedListingView);
            //             collapsedListingView.render({parentDiv: feedview.$el}); 
            //         });
            //     },
            //     error: function(){
            //         //TODO: display error in a div
            //         console.log('error!');
            //     }
            // });
            return this;
        },

        addListingView: function(listing){
            var collapsedListingView = new CollapsedListingView({model: listing});
            this.childViews.push(collapsedListingView);
            this.collection.add(collapsedListingView);
            collapsedListingView.render({parentDiv: this.$el}); 
        },
    });

    return FeedView;
});
