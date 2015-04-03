var ListingsView = Backbone.View.extend({

    initialize:function () {
        this.listing_collection = new ListingCollection();
    },

    render: function (){
        //render each listing view inside of listings
        var listingsView = this;
        this.listing_collection.fetch({
            //fetch must be called asynchronously to work!
            success: function(){
                //remove the loading listings message
                listingsView.$el.text('');
                listingsView.listing_collection.models.forEach(function(m){
                    var listingView = new ListingView({model: m});
                    listingsView.$el.append(listingView.$el); 
                    listingView.render(); 
                });
                return listingsView;
            },
            error: function(){
                //TODO: display error in a div
                console.log('error!');
            }
        });
    }
});
