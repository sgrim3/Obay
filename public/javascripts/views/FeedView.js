var FeedView = Backbone.View.extend({

    initialize:function () {
        this.collection = new Feed();
    },

    render: function (){
        //render each listing view inside of listings
        var feedview = this;
        this.collection.fetch({
            //fetch must be called asynchronously to work!
            success: function(){
                //remove the loading listings message
                console.log(feedview);
                console.log(feedview.collection.models);
                feedview.$el.text('');
                feedview.collection.models.forEach(function(m){
                    console.log('rendering collapsed listing view from inside feedview');
                    console.log(m);
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
    }
});