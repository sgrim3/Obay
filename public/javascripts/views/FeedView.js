var FeedView = Backbone.View.extend({

    initialize:function (freeFilter) {
        this.listenTo(Backbone.pubSub, 'listingAdded', this.addListingView);
        console.log(freeFilter)
        this.collection = freeFilter;
    },

    render: function (){
        //render each listing view inside of listings
        var feedview = this;
        this.collection.fetch({
            //fetch must be called asynchronously to work!
            success: function(){
                //remove the loading listings message
                feedview.$el.text('');
                feedview.collection.models.forEach(function(m){
                    var collapsedListingView = new CollapsedListingView({model: m});
                    feedview.$el.append(collapsedListingView.$el); 
                    collapsedListingView.render(); 
                });
                return feedview;
            },
            error: function(){
                //TODO: display error in a div
                console.log('error!');
            }
        });
    },

    addListingView: function(model){
        console.log("hdz FeedView addListingView");
        var collapsedListingView = new CollapsedListingView({model: model});
        this.collection.add(collapsedListingView);
        this.$el.prepend(collapsedListingView.$el); 
        collapsedListingView.render(); 
    },
});
