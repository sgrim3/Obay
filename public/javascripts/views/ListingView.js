window.ListingView = Backbone.View.extend({

	initialize:function (options) {
        this.render(options);
    },

    render: function(options){
    	if (options.id) {
    		this.model = new Listing({id:options.id});
    		var listingView = this;
	    	this.model.fetch({
	    		success: function(listing){
	    			listingView.$el.html(listingView.template(listing.attributes));
	         		return listingView;
	    		},
	    		error: function(err){
                    console.log('Error loading object from server!');
	    		}
            });
	    }
	    else{
	    	console.log('no object to look for');
	    }
    }
});
