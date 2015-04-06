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
            console.log("Here are the listings:");
            console.log(listing.attributes);
	    			listingView.$el.html(listingView.template(listing.attributes));
	         		return listingView;
	    		},
	    		error: function(){
	    			console.log('error!');
	    		}
            });
	    }
	    else{
	    	console.log('no object to look for');
	    }
    }
});
